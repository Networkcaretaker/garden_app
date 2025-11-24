export type PlantIdentificationSource = 'vision_api' | 'gpt' | 'manual';

export interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  careInstructions: string;
  images: string[];
  identifiedBy: PlantIdentificationSource;
  usedInProjects: string[];
  createdAt: string;
}