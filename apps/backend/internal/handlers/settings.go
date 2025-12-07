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
			return c.JSON(http.StatusOK, map[string]interface{}{
				"websiteURL": "",
				"title":      "",
				"tagline":    "",
			})
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
	// Define structs to match the Typescript interfaces
	type SocialLinks struct {
		Facebook  string `json:"facebook"`
		Instagram string `json:"instagram"`
		Linkedin  string `json:"linkedin"`
		Whatsapp  string `json:"whatsapp"`
	}

	var req struct {
		Title       string      `json:"title"`
		WebsiteURL  string      `json:"websiteURL"`
		Tagline     string      `json:"tagline"`
		Description string      `json:"description"`
		Excerpt     string      `json:"excerpt"`
		Social      SocialLinks `json:"social"`
		SEO         []string    `json:"seo"`
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	ctx := context.Background()
	docRef := h.Client.Firestore.Collection(settingsCollection).Doc(websiteDocument)

	// Construct the map to save. 
	// We map the struct fields explicitly to ensure only valid data is saved.
	data := map[string]interface{}{
		"title":       req.Title,
		"websiteURL":  req.WebsiteURL,
		"tagline":     req.Tagline,
		"description": req.Description,
		"excerpt":     req.Excerpt,
		"social": map[string]string{
			"facebook":  req.Social.Facebook,
			"instagram": req.Social.Instagram,
			"linkedin":  req.Social.Linkedin,
			"whatsapp":  req.Social.Whatsapp,
		},
		"seo":       req.SEO,
		"updatedAt": time.Now(),
	}

	// Use Set with MergeAll to create the document if it doesn't exist or update existing fields
	_, err := docRef.Set(ctx, data, firestore.MergeAll)

	if err != nil {
		c.Logger().Errorf("Failed to update website settings: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update settings"})
	}

	return c.JSON(http.StatusOK, map[string]string{"status": "success"})
}

// PublishWebsiteData handles POST /admin/settings/website/publish
func (h *SettingsHandler) PublishWebsiteData(c echo.Context) error {
	ctx := context.Background()
	
	// Get bucket handle once for both operations
	bucket, err := h.Client.Storage.Bucket(h.Config.FirebaseStorageBucket)
	if err != nil {
		c.Logger().Errorf("Failed to get storage bucket: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to access storage bucket"})
	}

	// Helper function to upload JSON to a specific path
	uploadJSON := func(objectPath string, data interface{}) error {
		jsonData, err := json.MarshalIndent(data, "", "  ")
		if err != nil {
			return err
		}
		
		wc := bucket.Object(objectPath).NewWriter(ctx)
		wc.ContentType = "application/json"
		if _, err := wc.Write(jsonData); err != nil {
			return err
		}
		return wc.Close()
	}

	// --- OPERATION 1: PROJECTS JSON ---

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

	if err := uploadJSON("website/projects.json", projects); err != nil {
		c.Logger().Errorf("Failed to upload projects JSON: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to upload projects data"})
	}

	// --- OPERATION 2: SETTINGS JSON ---

	// 1. Fetch website settings
	settingsDoc, err := h.Client.Firestore.Collection(settingsCollection).Doc(websiteDocument).Get(ctx)
	if err != nil {
		c.Logger().Errorf("Failed to fetch settings for publish: %v", err)
		// We continue even if settings fail? Or return error? 
		// Usually safer to fail so state isn't partial.
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch website settings"})
	}

	var settingsData map[string]interface{}
	if err := settingsDoc.DataTo(&settingsData); err != nil {
		c.Logger().Errorf("Failed to parse settings for publish: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to parse website settings"})
	}

	if err := uploadJSON("website/websiteConfig.json", settingsData); err != nil {
		c.Logger().Errorf("Failed to upload settings JSON: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to upload settings data"})
	}

	c.Logger().Info("Successfully published website data (projects.json and websiteConfig.json)")
	return c.JSON(http.StatusOK, map[string]string{
		"status": "success", 
		"message": "Website data and configuration published successfully",
	})
}