package db

import (
	"context"
	"fmt"
	"path/filepath"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"firebase.google.com/go/v4/storage" // Import storage
	"google.golang.org/api/option"
)

// Client holds the database, auth, and storage connection logic
type Client struct {
	Firestore *firestore.Client
	Auth      *auth.Client
	Storage   *storage.Client // Add Storage client
}

// NewClient initializes a new Firebase app with Firestore, Auth, and Storage
func NewClient(ctx context.Context, credentialsFile string, projectID string) (*Client, error) {
	if credentialsFile == "" {
		return nil, fmt.Errorf("credentials file path is empty")
	}

	absPath, err := filepath.Abs(credentialsFile)
	if err != nil {
		return nil, fmt.Errorf("failed to resolve absolute path: %v", err)
	}

	// Initialize Firebase App
	// We need to specify the Storage Bucket here if we want to use DefaultBucket()
	// For now, we will pass it via config or environment variables later, 
	// but the Admin SDK can often infer it if configured in the Service Account or we pass it explicitly.
	opt := option.WithCredentialsFile(absPath)
	conf := &firebase.Config{
		ProjectID: projectID,
		// If you know your bucket name, you can add it here:
		// StorageBucket: "garden-projects.appspot.com",
	}

	app, err := firebase.NewApp(ctx, conf, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing firebase app: %v", err)
	}

	firestoreClient, err := app.Firestore(ctx)
	if err != nil {
		return nil, fmt.Errorf("error initializing firestore client: %v", err)
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		return nil, fmt.Errorf("error initializing auth client: %v", err)
	}

	// Initialize Storage Client
	storageClient, err := app.Storage(ctx)
	if err != nil {
		return nil, fmt.Errorf("error initializing storage client: %v", err)
	}

	return &Client{
		Firestore: firestoreClient,
		Auth:      authClient,
		Storage:   storageClient,
	}, nil
}

func (c *Client) Close() error {
	return c.Firestore.Close()
}