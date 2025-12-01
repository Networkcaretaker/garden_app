package handlers

import (
	"context"
	"net/http"
	"time"

	"cloud.google.com/go/firestore" // Make sure this import is here
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
	// 1. Bind the incoming JSON to our Request struct
	req := new(models.CreateProjectRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	// 2. Prepare the data for Firestore
	now := time.Now()
	newProject := models.Project{
		Title:       req.Title,
		Description: req.Description,
		Location:    req.Location,
		Category:    req.Category,
		Images:      req.Images,
		Published:   false, // Draft by default
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// 3. Save to Firestore
	// We use .Add() to let Firestore generate a unique ID
	ctx := context.Background()
	ref, _, err := h.Client.Firestore.Collection("projects").Add(ctx, newProject)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to save project"})
	}

	// 4. Return the ID and data
	newProject.ID = ref.ID
	return c.JSON(http.StatusCreated, newProject)
}

// GetProjects handles GET /projects
func (h *ProjectHandler) GetProjects(c echo.Context) error {
	ctx := context.Background()
	var projects []models.Project

	// 1. Query Firestore
	iter := h.Client.Firestore.Collection("projects").Documents(ctx)
	defer iter.Stop()

	// 2. Iterate through results
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch projects"})
		}

		var p models.Project
		// Map Firestore document to struct
		if err := doc.DataTo(&p); err != nil {
			continue // Skip bad data
		}
		// Manually set ID because it's stored in the document ref, not the data
		p.ID = doc.Ref.ID
		projects = append(projects, p)
	}

	return c.JSON(http.StatusOK, projects)
}

// UpdateProject handles PUT /projects/:id
func (h *ProjectHandler) UpdateProject(c echo.Context) error {
	// 1. Get the ID from the URL
	id := c.Param("id")
	if id == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Missing project ID"})
	}

	// 2. Bind the incoming JSON
	req := new(models.CreateProjectRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	ctx := context.Background()

	// 3. Define the updates
	// We use firestore.Update structs to be explicit about what changes
	updates := []firestore.Update{
		{Path: "title", Value: req.Title},
		{Path: "description", Value: req.Description},
		{Path: "location", Value: req.Location},
		{Path: "category", Value: req.Category},
		{Path: "images", Value: req.Images},
		{Path: "updatedAt", Value: time.Now()},
	}

	// 4. Execute Update
	// This will fail automatically if the document does not exist
	_, err := h.Client.Firestore.Collection("projects").Doc(id).Update(ctx, updates)
	if err != nil {
		// We could check status codes here (e.g., NotFound), but for MVP 500 is okay
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update project"})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"id":      id,
		"status":  "updated",
		"message": "Project updated successfully",
	})
}