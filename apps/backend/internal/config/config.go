package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all the application configuration
type Config struct {
	Port                    string
	Env                     string
	FirebaseCredentialsFile string
	FirebaseProjectID       string
	FirebaseStorageBucket   string
}

// Load reads the .env file and populates the Config struct
func Load() (*Config, error) {
	// Load .env file if it exists (it might not exist in production/Cloud Run)
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found, relying on system environment variables")
	}

	cfg := &Config{
		Port:                    getEnv("PORT", "8080"),
		Env:                     getEnv("ENV", "development"),
		FirebaseCredentialsFile: getEnv("FIREBASE_CREDENTIALS_FILE", ""),
		FirebaseProjectID:       getEnv("FIREBASE_PROJECT_ID", ""),
		FirebaseStorageBucket:   getEnv("FIREBASE_STORAGE_BUCKET", ""),
	}

	// Validate required variables
	if cfg.FirebaseCredentialsFile == "" {
		return nil, fmt.Errorf("FIREBASE_CREDENTIALS_FILE is required")
	}

	return cfg, nil
}

// Helper function to get env var with a fallback default
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}