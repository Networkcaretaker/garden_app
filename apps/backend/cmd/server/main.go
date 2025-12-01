package main

import (
	"context"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/networkcaretaker/garden_app/backend/internal/config"
	"github.com/networkcaretaker/garden_app/backend/internal/db"
)

func main() {
	// 1. Load Configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 2. Initialize Database Connection
	// We use context.Background() because this is the startup phase
	ctx := context.Background()
	database, err := db.NewClient(ctx, cfg.FirebaseCredentialsFile, cfg.FirebaseProjectID)
	if err != nil {
		log.Fatalf("Failed to connect to Firestore: %v", err)
	}
	// Defer closing the database until the main function exits
	defer database.Close()
	log.Println("✅ Connected to Firestore successfully")

	// 3. Initialize Echo
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello! Backend is connected to Firestore. 🌿")
	})

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "healthy",
			"db":     "connected",
			"env":    cfg.Env,
		})
	})

	// Start Server
	log.Printf("Starting server on port %s...", cfg.Port)
	e.Logger.Fatal(e.Start(":" + cfg.Port))
}
