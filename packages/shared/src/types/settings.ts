import type { Timestamp } from 'firebase/firestore';

export type buttonVariants = 'solid' | 'outline' | 'projects' | 'none';

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  whatsappMessage: string;
}

export interface CallToAction {
  text: string;
  buttonText: string;
  buttonVariant: buttonVariants;
}

export interface WebsiteImage {
  id: string;
  url: string;
  storagePath: string; // store the internal path for deletion
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

export interface TestimonialClients {
  project: string;
  name: string;
  occupation: string;
  text: string;
  imageType: string;
  images: WebsiteImage[];
}

export interface TestimonialContent {
  title: string;
  text: string;
  project?: string; // this will be from a list of Active projects with hasTestimonial = true
  clients: TestimonialClients[]; // this can be removed later when the new testinonial section is complete
}

export interface FootorContent {
  title: string;
  text: string;
  showCTA: boolean;
  cta: CallToAction;
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

export interface ProjectSettings {
  categories: string[];
  tags: string[];
  updatedAt: Timestamp;
}