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
		// This is expected in production, so we just log a message or ignore
		// fmt.Println("No .env file found, relying on system environment variables")
	}

	cfg := &Config{
		Port:                    getEnv("PORT", "8080"),
		Env:                     getEnv("ENV", "development"),
		FirebaseCredentialsFile: getEnv("FIREBASE_CREDENTIALS_FILE", ""),
		FirebaseProjectID:       getEnv("FIREBASE_PROJECT_ID", ""),
		FirebaseStorageBucket:   getEnv("FIREBASE_STORAGE_BUCKET", ""),
	}

	// Validate required variables
	// Note: We NO LONGER check for FirebaseCredentialsFile here
	if cfg.FirebaseProjectID == "" {
		return nil, fmt.Errorf("FIREBASE_PROJECT_ID is required")
	}
	if cfg.FirebaseStorageBucket == "" {
		return nil, fmt.Errorf("FIREBASE_STORAGE_BUCKET is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}