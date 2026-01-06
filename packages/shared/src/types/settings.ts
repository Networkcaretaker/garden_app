import type { Timestamp } from 'firebase/firestore';
import type { Testimonial, ProjectImage } from './project';

export type buttonVariants = 'solid' | 'outline' | 'projects' | 'none';
export type ctaButtonVariants = 'whatsapp' | 'projects';
export type fbLinks = 'user' | 'page' | 'group';

export interface SocialLinks {
  facebook: string;
  facebookPage: string;
  facebookGroup: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  whatsappMessage: string;
}

export interface Facebook {
  buttonText: string;
  linkPage: fbLinks;
}

export interface CallToAction {
  text: string;
  buttonText: string;
  buttonVariant: buttonVariants;
}

export interface WebsiteImage {
  id: string;
  url: string;
  storagePath: string;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ContentCard {
  title: string;
  text: string;
  image: WebsiteImage;
  link: string;
  order: number;
}

export interface HeroContent {
  logo: boolean;
  title: boolean;
  tagline: boolean;
  description: boolean;
  showCTA: boolean;
  cta: CallToAction;
  projects: string[];
}

export interface AboutContent {
  title: string;
  text: string;
  showCTA: boolean;
  cta: CallToAction;
  background?: WebsiteImage;
}

export interface BenefitsContent {
  title: string;
  text: string;
  cards: ContentCard[];
}

export interface ServicesContent {
  title: string;
  text: string;
  cards: ContentCard[];
}

export interface LocationContent {
  title: string;
  text: string;
  showCTA: boolean;
  cta: CallToAction;
}

export interface GalleryContent {
  title: string;
  text: string;
  projects: string[];
}

export interface TestimonialContent {
  title: string;
  text: string;
  projects?: string[];
}

// New type for the frontend published data
export interface PublishedTestimonialContent {
  title: string;
  text: string;
  projects?: PublishedTestimonialProject[]; // For frontend - stores full project objects
}

export interface PublishedTestimonial {
  name: string;
  occupation: string;
  text: string;
  image: 'featured' | 'gallery';
  imageGroup?: {
    id: string;
    type: 'gallery' | 'slider';
    name: string;
    description: string;
    order: number;
    images: ProjectImage[];
  };
}
export interface PublishedTestimonialProject {
  id: string;
  coverImage: string;
  testimonial: PublishedTestimonial; // Use PublishedTestimonial, not Testimonial
}

export interface FootorContent {
  title: string;
  text: string;
  showCTA: boolean;
  cta: CallToAction;
  showFacebook: boolean;
  facebook: Facebook;
}

export interface WebsiteContent {
  hero: HeroContent;
  about: AboutContent;
  benefits: BenefitsContent;
  services: ServicesContent;
  location: LocationContent;
  gallery: GalleryContent;
  testimonials: TestimonialContent;
  footer: FootorContent;
}

export interface WebsiteSettings {
  title: string;
  websiteURL: string;
  tagline: string;
  description: string;
  excerpt: string;
  logo: WebsiteImage;
  content: WebsiteContent;
  social: SocialLinks;
  seo: string[];
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  projectUpdatedAt?: Timestamp;
}

// Add a new type for published/frontend data
export interface PublishedWebsiteSettings extends Omit<WebsiteSettings, 'content'> {
  content: Omit<WebsiteContent, 'testimonials'> & {
    testimonials: PublishedTestimonialContent;
  };
}

export interface ProjectSettings {
  categories: string[];
  tags: string[];
  updatedAt: Timestamp;
}