package models

import "time"

// Project represents the data structure for a gardening project
type Project struct {
	ID            string    `json:"id" firestore:"id"`
	Title         string    `json:"title" firestore:"title"`
	Description   string    `json:"description" firestore:"description"`
	Location      string    `json:"location" firestore:"location"`
	CompletedDate string    `json:"completedDate" firestore:"completedDate"`
	Category      string    `json:"category" firestore:"category"`
	CoverImage    string    `json:"coverImage" firestore:"coverImage"`
	Images        []string  `json:"images" firestore:"images"`
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

// UpdateProjectRequest defines what can be updated
type UpdateProjectRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Location    string   `json:"location"`
	Category    string   `json:"category"`
	Images      []string `json:"images"`
	Featured    bool     `json:"featured"`
	Published   bool     `json:"published"`
}