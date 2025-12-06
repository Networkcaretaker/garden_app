package handlers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/labstack/echo/v4"
	"github.com/networkcaretaker/garden_app/backend/internal/config"
	"github.com/networkcaretaker/garden_app/backend/internal/db"
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
