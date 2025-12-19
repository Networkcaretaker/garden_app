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

// Testimonial represents a client testimonial for a project
type Testimonial struct {
	Name      string `json:"name" firestore:"name"`
	Occupation string `json:"occupation" firestore:"occupation"`
	Text      string `json:"text" firestore:"text"`
}
// Project represents the data structure for a gardening project
type Project struct {
	ID            string         `json:"id" firestore:"id"`
	Title         string         `json:"title" firestore:"title"`
	Description   string         `json:"description" firestore:"description"`
	Location      string         `json:"location" firestore:"location"`
	CompletedDate string         `json:"completedDate" firestore:"completedDate"`
	Category      string         `json:"category" firestore:"category"`
	Tags          []string       `json:"tags" firestore:"tags"`
	CoverImage    string         `json:"coverImage" firestore:"coverImage"`
	Images        []ProjectImage `json:"images" firestore:"images"`
	Featured      bool           `json:"featured" firestore:"featured"`
	HasTestimonial *bool          `json:"hasTestimonial,omitempty" firestore:"hasTestimonial,omitempty"` // Pointer to allow nil/omission
	Testimonial    *Testimonial   `json:"testimonial,omitempty" firestore:"testimonial,omitempty"`       // Pointer to allow nil/omission
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
	Tags        []string       `json:"tags"`
	Status      string         `json:"status"`
	CoverImage  string         `json:"coverImage"` // Added required field
	Images      []ProjectImage `json:"images"`
	HasTestimonial *bool          `json:"hasTestimonial,omitempty"`
	Testimonial    *Testimonial   `json:"testimonial,omitempty"`
}