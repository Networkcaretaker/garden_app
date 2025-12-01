package models

import "time"

// Project represents the data structure for a gardening project
// The tags (`...`) tell Go how to read/write this to JSON and Firestore
type Project struct {
	ID            string    `json:"id" firestore:"id"`
	Title         string    `json:"title" firestore:"title"`
	Description   string    `json:"description" firestore:"description"`
	Location      string    `json:"location" firestore:"location"`
	CompletedDate string    `json:"completedDate" firestore:"completedDate"` // Using string for simplicity in MVP, could be time.Time
	Category      string    `json:"category" firestore:"category"`
	CoverImage    string    `json:"coverImage" firestore:"coverImage"`
	Images        []string  `json:"images" firestore:"images"` // Array of image URLs/IDs
	Featured      bool      `json:"featured" firestore:"featured"`
	Published     bool      `json:"published" firestore:"published"`
	CreatedAt     time.Time `json:"createdAt" firestore:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt" firestore:"updatedAt"`
}

// CreateProjectRequest defines what we expect the frontend to send when creating a project
type CreateProjectRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Location    string   `json:"location"`
	Category    string   `json:"category"`
	Images      []string `json:"images"`
}