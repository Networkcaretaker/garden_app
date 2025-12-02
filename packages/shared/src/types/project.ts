export type ProjectCategory = 'residential' | 'commercial' | 'landscape';

export interface AIGeneratedContent {
  description: boolean;
  plantIdentifications: string[];
}

export interface ProjectImage {
  id: string;          // Unique ID (e.g. timestamp-random)
  url: string;         // The full storage URL
  thumbnail?: string;  // Optional: distinct thumbnail URL if we generate one later
  caption?: string;    // "View of the patio from the south"
  alt?: string;        // Accessibility text
  width?: number;      // Useful for Next.js Image component to prevent layout shift
  height?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  completedDate: string;
  category: ProjectCategory;
  // We keep coverImage as a string ID or URL for quick lookup
  coverImage: string; 
  // Now strictly an array of objects
  images: ProjectImage[]; 
  aiGenerated?: AIGeneratedContent;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Update the Input type so the API knows to expect objects
export interface ProjectCreateInput {
  title: string;
  description?: string;
  location: string;
  category: ProjectCategory;
  images: ProjectImage[]; 
}