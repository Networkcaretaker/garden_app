package db

import (
	"context"
	"fmt"
	"path/filepath"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

// Client holds the database connection logic
type Client struct {
	Firestore *firestore.Client
}

// NewClient initializes a new Firestore client
func NewClient(ctx context.Context, credentialsFile string, projectID string) (*Client, error) {
	// 1. Validate inputs
	if credentialsFile == "" {
		return nil, fmt.Errorf("credentials file path is empty")
	}

	// 2. Resolve absolute path to the service account file
	// This ensures it works whether we run 'go run' from root or inside subfolders
	absPath, err := filepath.Abs(credentialsFile)
	if err != nil {
		return nil, fmt.Errorf("failed to resolve absolute path: %v", err)
	}

	// 3. Initialize Firebase App
	opt := option.WithCredentialsFile(absPath)
	conf := &firebase.Config{ProjectID: projectID}

	app, err := firebase.NewApp(ctx, conf, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing firebase app: %v", err)
	}

	// 4. Create Firestore Client
	firestoreClient, err := app.Firestore(ctx)
	if err != nil {
		return nil, fmt.Errorf("error initializing firestore client: %v", err)
	}

	return &Client{Firestore: firestoreClient}, nil
}

// Close safely closes the database connection
func (c *Client) Close() error {
	return c.Firestore.Close()
}