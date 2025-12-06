import type { Timestamp } from 'firebase/firestore';

export interface WebsiteSettings {
  websiteURL: string;
  updatedAt: Timestamp;
}