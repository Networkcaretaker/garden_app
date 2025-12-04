package db

import (
	"context"
	"fmt"
	"path/filepath"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"firebase.google.com/go/v4/storage"
	"google.golang.org/api/option"
)

// Client holds the database, auth, and storage connection logic
type Client struct {
	Firestore *firestore.Client
	Auth      *auth.Client
	Storage   *storage.Client
}

// NewClient initializes a new Firebase app with Firestore, Auth, and Storage
func NewClient(ctx context.Context, credentialsFile string, projectID string) (*Client, error) {
	conf := &firebase.Config{
		ProjectID: projectID,
	}

	var app *firebase.App
	var err error

	if credentialsFile != "" {
		// Local Development: Use the JSON key file
		absPath, err := filepath.Abs(credentialsFile)
		if err != nil {
			return nil, fmt.Errorf("failed to resolve absolute path: %v", err)
		}
		opt := option.WithCredentialsFile(absPath)
		app, err = firebase.NewApp(ctx, conf, opt)
	} else {
		// Production (Cloud Run): Use Application Default Credentials (ADC)
		// The SDK automatically finds credentials from the environment
		app, err = firebase.NewApp(ctx, conf)
	}

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