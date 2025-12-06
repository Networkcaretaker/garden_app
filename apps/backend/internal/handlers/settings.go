package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/labstack/echo/v4"
	"github.com/networkcaretaker/garden_app/backend/internal/config"
	"github.com/networkcaretaker/garden_app/backend/internal/db"
	"github.com/networkcaretaker/garden_app/backend/internal/models"
	"google.golang.org/api/iterator"
)

// SettingsHandler holds the database connection
type SettingsHandler struct {
	Client *db.Client
	Config *config.Config
}

// NewSettingsHandler creates a new handler instance
func NewSettingsHandler(client *db.Client, cfg *config.Config) *SettingsHandler {
	return &SettingsHandler{Client: client, Config: cfg}
}

const settingsCollection = "settings"
const websiteDocument = "website"

// GetWebsiteSettings handles GET /settings/website
func (h *SettingsHandler) GetWebsiteSettings(c echo.Context) error {
	ctx := context.Background()
	doc, err := h.Client.Firestore.Collection(settingsCollection).Doc(websiteDocument).Get(ctx)
	if err != nil {
		// If the document doesn't exist, return default/empty values
		if strings.Contains(err.Error(), "NotFound") {
			return c.JSON(http.StatusOK, map[string]string{"websiteURL": ""})
		}
		c.Logger().Errorf("Failed to fetch website settings: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch website settings"})
	}

	var settings map[string]interface{}
	if err := doc.DataTo(&settings); err != nil {
		c.Logger().Errorf("Failed to parse website settings: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to parse website settings"})
	}

	return c.JSON(http.StatusOK, settings)
}

// UpdateWebsiteSettings handles PUT /admin/settings/website
func (h *SettingsHandler) UpdateWebsiteSettings(c echo.Context) error {
	var req struct {
		WebsiteURL string `json:"websiteURL"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	ctx := context.Background()
	docRef := h.Client.Firestore.Collection(settingsCollection).Doc(websiteDocument)

	// Use Set with MergeAll to create the document if it doesn't exist
	_, err := docRef.Set(ctx, map[string]interface{}{
		"websiteURL": req.WebsiteURL,
		"updatedAt":  time.Now(),
	}, firestore.MergeAll)

	if err != nil {
		c.Logger().Errorf("Failed to update website settings: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update settings"})
	}

	return c.JSON(http.StatusOK, map[string]string{"status": "success"})
}

// PublishWebsiteData handles POST /admin/settings/website/publish
func (h *SettingsHandler) PublishWebsiteData(c echo.Context) error {
	ctx := context.Background()

	// 1. Fetch all 'active' projects
	var projects []models.Project
	iter := h.Client.Firestore.Collection("projects").
		Where("status", "==", "active").
		OrderBy("createdAt", firestore.Desc).
		Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.Logger().Errorf("Failed to iterate projects: %v", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch projects"})
		}

		var p models.Project
		if err := doc.DataTo(&p); err != nil {
			c.Logger().Warnf("Failed to parse project %s: %v", doc.Ref.ID, err)
			continue
		}
		p.ID = doc.Ref.ID
		projects = append(projects, p)
	}

	// 2. Serialize projects to JSON
	jsonData, err := json.MarshalIndent(projects, "", "  ")
	if err != nil {
		c.Logger().Errorf("Failed to marshal projects to JSON: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to generate JSON data"})
	}

	// 3. Upload JSON to Firebase Storage
	bucket, err := h.Client.Storage.Bucket(h.Config.FirebaseStorageBucket)
	if err != nil {
		c.Logger().Errorf("Failed to get storage bucket: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to access storage bucket"})
	}

	objectPath := "website/projects.json"
	wc := bucket.Object(objectPath).NewWriter(ctx)
	wc.ContentType = "application/json"
	if _, err := wc.Write(jsonData); err != nil {
		c.Logger().Errorf("Failed to write JSON to storage: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to upload JSON file"})
	}
	if err := wc.Close(); err != nil {
		c.Logger().Errorf("Failed to close storage writer: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to finalize JSON upload"})
	}

	c.Logger().Infof("Successfully published website data to %s", objectPath)
	return c.JSON(http.StatusOK, map[string]string{"status": "success", "message": "Website data published successfully"})
}
