export type ProjectCategory = 'residential' | 'commercial' | 'landscape';

export interface AIGeneratedContent {
  description: boolean;
  plantIdentifications: string[];
}

export interface ProjectImage {
  id: string;
  url: string;
  // New field: store the internal path for deletion
  storagePath: string; 
  thumbnail?: string;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  completedDate: string;
  category: ProjectCategory;
  coverImage: string;
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
  images: ProjectImage[];
}