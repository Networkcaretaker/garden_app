package models

import "time"

type ProjectImage struct {
	ID          string `json:"id" firestore:"id"`
	URL         string `json:"url" firestore:"url"`
	StoragePath string `json:"storagePath" firestore:"storagePath"` // Added this field
	Thumbnail   string `json:"thumbnail,omitempty" firestore:"thumbnail,omitempty"`
	Caption     string `json:"caption,omitempty" firestore:"caption,omitempty"`
	Alt         string `json:"alt,omitempty" firestore:"alt,omitempty"`
	Width       int    `json:"width,omitempty" firestore:"width,omitempty"`
	Height      int    `json:"height,omitempty" firestore:"height,omitempty"`
}

// Project represents the data structure for a gardening project
type Project struct {
	ID            string         `json:"id" firestore:"id"`
	Title         string         `json:"title" firestore:"title"`
	Description   string         `json:"description" firestore:"description"`
	Location      string         `json:"location" firestore:"location"`
	CompletedDate string         `json:"completedDate" firestore:"completedDate"`
	Category      string         `json:"category" firestore:"category"`
	CoverImage    string         `json:"coverImage" firestore:"coverImage"`
	Images        []ProjectImage `json:"images" firestore:"images"`
	Featured      bool           `json:"featured" firestore:"featured"`
	Published     bool           `json:"published" firestore:"published"`
	Status        string         `json:"status" firestore:"status,omitempty"`
	CreatedAt     time.Time      `json:"createdAt" firestore:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt" firestore:"updatedAt"`
}

type CreateProjectRequest struct {
	ID          string         `json:"id"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Location    string         `json:"location"`
	Category    string         `json:"category"`
	Images      []ProjectImage `json:"images"`
}