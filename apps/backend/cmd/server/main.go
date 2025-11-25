package main

import (
	"net/http"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Initialize Echo instance
	e := echo.New()

	// Middleware
	// Logger: Prints info about every request to the terminal
	e.Use(middleware.Logger())
	// Recover: Recovers from panics anywhere in the chain, prevents server crash
	e.Use(middleware.Recover())

	// CORS: Allow frontend to communicate (We will configure this more strictly later)
	e.Use(middleware.CORS())

	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello from the Garden App Backend! 🌿")
	})

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "healthy",
			"app":    "garden_app",
		})
	})

	// Start Server on port 8080
	e.Logger.Fatal(e.Start(":8080"))
}