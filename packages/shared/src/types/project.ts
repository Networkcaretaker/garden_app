export type ProjectCategory = 'residential' | 'commercial' | 'landscape';

export interface AIGeneratedContent {
  description: boolean;
  plantIdentifications: string[];
}

export interface ProjectImage {
  id: string;
  thumbnail: string;
  standard: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  completedDate: string;
  category: ProjectCategory;
  coverImage: string; // References an image ID
  images: ProjectImage[];
  aiGenerated?: AIGeneratedContent;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCreateInput {
  title: string;
  description?: string;
  location: string;
  category: ProjectCategory;
  images: string[]; // Array of image IDs uploaded previously
}