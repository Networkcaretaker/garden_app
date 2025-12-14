import type { Timestamp } from 'firebase/firestore';

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
}

export interface WebsiteSettings {
  title: string;
  websiteURL: string;
  tagline: string;
  description: string;
  excerpt: string;
  social: SocialLinks;
  seo: string[];
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  projectUpdatedAt?: Timestamp;
}

export interface ProjectSettings {
  categories: string[];
  tags: string[];
  updatedAt: Timestamp;
}