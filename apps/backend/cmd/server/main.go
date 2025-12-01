package main

import (
	"context"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	// Remember to use your lowercase module name here!
	"github.com/networkcaretaker/garden_app/backend/internal/config"
	"github.com/networkcaretaker/garden_app/backend/internal/db"
	customMiddleware "github.com/networkcaretaker/garden_app/backend/internal/middleware"
)

func main() {
	// 1. Load Configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 2. Initialize Database & Auth
	ctx := context.Background()
	// Note: variable name changed from 'database' to 'services' to reflect it holds both DB and Auth
	services, err := db.NewClient(ctx, cfg.FirebaseCredentialsFile, cfg.FirebaseProjectID)
	if err != nil {
		log.Fatalf("Failed to connect to Firebase: %v", err)
	}
	defer services.Close()
	log.Println("✅ Connected to Firestore & Auth successfully")

	// 3. Initialize Echo
	e := echo.New()

	// Global Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// --- Public Routes ---
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Garden App API is running 🌿")
	})

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "healthy"})
	})

	// --- Protected Routes (Admin Only) ---
	// Create a group for routes that require login
	adminGroup := e.Group("/admin")
	
	// Apply our custom Auth middleware to this group
	adminGroup.Use(customMiddleware.AuthMiddleware(services.Auth))

	// Test endpoint to verify auth works
	adminGroup.GET("/me", func(c echo.Context) error {
		// Retrieve the UID we stored in the middleware
		uid := c.Get("uid").(string)
		return c.JSON(http.StatusOK, map[string]string{
			"message": "You are authenticated!",
			"uid":     uid,
		})
	})

	// Start Server
	log.Printf("Starting server on port %s...", cfg.Port)
	e.Logger.Fatal(e.Start(":" + cfg.Port))
}