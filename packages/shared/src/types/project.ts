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
  coverImage: string;
  // Fix: Allow string[] (URLs) OR ProjectImage[] (Objects)
  // The MVP uses string[], the future version might use ProjectImage[]
  images: string[] | ProjectImage[]; 
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
  images: string[];
}