package main

import (
	"context"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/networkcaretaker/garden_app/backend/internal/config"
	"github.com/networkcaretaker/garden_app/backend/internal/db"
	"github.com/networkcaretaker/garden_app/backend/internal/handlers" // Import handlers
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
	services, err := db.NewClient(ctx, cfg.FirebaseCredentialsFile, cfg.FirebaseProjectID)
	if err != nil {
		log.Fatalf("Failed to connect to Firebase: %v", err)
	}
	defer services.Close()
	log.Println("✅ Connected to Firestore & Auth successfully")

	// 3. Initialize Handlers
	projectHandler := handlers.NewProjectHandler(services)

	// 4. Initialize Echo
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

	// Public Project Routes (Read-only)
	e.GET("/projects", projectHandler.GetProjects)

	// --- Protected Routes (Admin Only) ---
	adminGroup := e.Group("/admin")
	adminGroup.Use(customMiddleware.AuthMiddleware(services.Auth))

	// Admin Project Routes (Write)
	adminGroup.POST("/projects", projectHandler.CreateProject)
	// We will add Update/Delete here later

	adminGroup.GET("/me", func(c echo.Context) error {
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