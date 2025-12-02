package handlers

import (
	"context"
	"net/http"
	"net/url"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/labstack/echo/v4"
	"github.com/networkcaretaker/garden_app/backend/internal/config"
	"github.com/networkcaretaker/garden_app/backend/internal/db"
	"github.com/networkcaretaker/garden_app/backend/internal/models"
	"google.golang.org/api/iterator"
)

// ProjectHandler holds the database connection and configuration
type ProjectHandler struct {
	Client *db.Client
	Config *config.Config
}

// NewProjectHandler creates a new handler instance
func NewProjectHandler(client *db.Client, cfg *config.Config) *ProjectHandler {
	return &ProjectHandler{Client: client, Config: cfg}
}

// CreateProject handles POST /projects
func (h *ProjectHandler) CreateProject(c echo.Context) error {
	req := new(models.CreateProjectRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	now := time.Now()
	newProject := models.Project{
		ID:            req.ID,
		Title:         req.Title,
		Description:   req.Description,
		Location:      req.Location,
		Category:      req.Category,
		Images:        req.Images,
		Published:     false,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	if len(newProject.Images) > 0 {
		newProject.CoverImage = newProject.Images[0].URL
	}

	ctx := context.Background()
	var err error

	if newProject.ID != "" {
		_, err = h.Client.Firestore.Collection("projects").Doc(newProject.ID).Set(ctx, newProject)
	} else {
		var ref *firestore.DocumentRef
		ref, _, err = h.Client.Firestore.Collection("projects").Add(ctx, newProject)
		if err == nil {
			newProject.ID = ref.ID
		}
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to save project"})
	}

	return c.JSON(http.StatusCreated, newProject)
}

// GetProjects handles GET /projects
func (h *ProjectHandler) GetProjects(c echo.Context) error {
	ctx := context.Background()
	var projects []models.Project

	iter := h.Client.Firestore.Collection("projects").OrderBy("createdAt", firestore.Desc).Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch projects"})
		}

		var p models.Project
		if err := doc.DataTo(&p); err != nil {
			continue
		}
		p.ID = doc.Ref.ID
		projects = append(projects, p)
	}

	return c.JSON(http.StatusOK, projects)
}

// UpdateProject handles PUT /projects/:id
func (h *ProjectHandler) UpdateProject(c echo.Context) error {
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing project ID"})
	}

	req := new(models.CreateProjectRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	ctx := context.Background()

	// 1. Fetch the EXISTING project first to compare images
	docRef := h.Client.Firestore.Collection("projects").Doc(id)
	docSnap, err := docRef.Get(ctx)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Project not found"})
	}

	var oldProject models.Project
	if err := docSnap.DataTo(&oldProject); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to parse existing project"})
	}

	// 2. Identify images to delete
	newImageMap := make(map[string]bool)
	for _, img := range req.Images {
		newImageMap[img.URL] = true
	}

	bucketName := h.Config.FirebaseStorageBucket
	bucket, err := h.Client.Storage.Bucket(bucketName)

	c.Logger().Infof("DEBUG: Checking for deleted images. Old count: %d, New count: %d", len(oldProject.Images), len(req.Images))

	if err == nil {
		for _, oldImg := range oldProject.Images {
			// Check if the old image exists in the new map
			exists := newImageMap[oldImg.URL]
			c.Logger().Infof("DEBUG: Checking image %s. Keep? %v", oldImg.URL, exists)

			if !exists {
				// Image removed! Determine the path to delete.
				var objectPath string

				if oldImg.StoragePath != "" {
					objectPath = oldImg.StoragePath
					c.Logger().Infof("DEBUG: Found StoragePath: %s", objectPath)
				} else {
					// Plan B: Fallback for legacy images
					c.Logger().Infof("DEBUG: No StoragePath, trying URL parsing for %s", oldImg.URL)
					parsedURL, parseErr := url.Parse(oldImg.URL)
					if parseErr == nil {
						parts := strings.Split(parsedURL.Path, "/o/")
						if len(parts) > 1 {
							decodedPath, decodeErr := url.QueryUnescape(parts[1])
							if decodeErr == nil {
								objectPath = decodedPath
								c.Logger().Infof("DEBUG: Parsed path: %s", objectPath)
							} else {
								c.Logger().Errorf("DEBUG: Failed to decode path: %v", decodeErr)
							}
						} else {
							c.Logger().Warnf("DEBUG: URL split failed, parts: %v", parts)
						}
					} else {
						c.Logger().Errorf("DEBUG: URL parse failed: %v", parseErr)
					}
				}

				// Execute Deletion if we found a path
				if objectPath != "" {
					go func(path string) {
						c.Logger().Infof("DEBUG: Attempting to delete object at path: %s from bucket %s", path, bucketName)
						if err := bucket.Object(path).Delete(context.Background()); err != nil {
							c.Logger().Errorf("Failed to delete image %s: %v", path, err)
						} else {
							c.Logger().Infof("Successfully deleted orphaned image: %s", path)
						}
					}(objectPath)
				} else {
					c.Logger().Warnf("Could not determine path for deletion: %s", oldImg.URL)
				}
			}
		}
	} else {
		c.Logger().Errorf("Failed to get bucket handle: %v", err)
	}

	// 3. Perform the Database Update
	updates := []firestore.Update{
		{Path: "title", Value: req.Title},
		{Path: "description", Value: req.Description},
		{Path: "location", Value: req.Location},
		{Path: "category", Value: req.Category},
		{Path: "images", Value: req.Images},
		{Path: "updatedAt", Value: time.Now()},
	}

	if len(req.Images) > 0 {
		updates = append(updates, firestore.Update{Path: "coverImage", Value: req.Images[0].URL})
	}

	_, err = docRef.Update(ctx, updates)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update project"})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"id":      id,
		"status":  "updated",
		"message": "Project updated successfully",
	})
}