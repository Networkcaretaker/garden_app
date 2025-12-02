package handlers

import (
	"context"
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/labstack/echo/v4"
	"github.com/networkcaretaker/garden_app/backend/internal/db"
	"github.com/networkcaretaker/garden_app/backend/internal/models"
	"google.golang.org/api/iterator"
)

// ProjectHandler holds the database connection
type ProjectHandler struct {
	Client *db.Client
}

// NewProjectHandler creates a new handler instance
func NewProjectHandler(client *db.Client) *ProjectHandler {
	return &ProjectHandler{Client: client}
}

// CreateProject handles POST /projects
func (h *ProjectHandler) CreateProject(c echo.Context) error {
	req := new(models.CreateProjectRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	now := time.Now()
	newProject := models.Project{
		Title:       req.Title,
		Description: req.Description,
		Location:    req.Location,
		Category:    req.Category,
		Images:      req.Images, // Direct assignment now works because both are []ProjectImage
		Published:   false, 
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Auto-set cover image to the first image if not specified (optional logic)
	if len(newProject.Images) > 0 {
		newProject.CoverImage = newProject.Images[0].URL
	}

	ctx := context.Background()
	ref, _, err := h.Client.Firestore.Collection("projects").Add(ctx, newProject)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to save project"})
	}

	newProject.ID = ref.ID
	return c.JSON(http.StatusCreated, newProject)
}

// GetProjects handles GET /projects
func (h *ProjectHandler) GetProjects(c echo.Context) error {
	ctx := context.Background()
	var projects []models.Project

	// Order by CreatedAt desc (newest first)
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

	// We bind to the Request struct, but in a real app you might want a specific Update struct
	// to allow partial updates. For now, we assume the frontend sends the full object.
	req := new(models.CreateProjectRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	ctx := context.Background()
	
	updates := []firestore.Update{
		{Path: "title", Value: req.Title},
		{Path: "description", Value: req.Description},
		{Path: "location", Value: req.Location},
		{Path: "category", Value: req.Category},
		{Path: "images", Value: req.Images}, // Updates the complex image array
		{Path: "updatedAt", Value: time.Now()},
	}

	// Update Cover Image if images changed
	if len(req.Images) > 0 {
		updates = append(updates, firestore.Update{Path: "coverImage", Value: req.Images[0].URL})
	}

	_, err := h.Client.Firestore.Collection("projects").Doc(id).Update(ctx, updates)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update project"})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"id":      id,
		"status":  "updated",
		"message": "Project updated successfully",
	})
}