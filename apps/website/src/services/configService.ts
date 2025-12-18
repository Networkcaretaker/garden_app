import type { WebsiteSettings } from '@garden/shared';

const VITE_WEBSITE_CONFIG_URL = import.meta.env.VITE_WEBSITE_CONFIG_URL;

export const DEFAULT_WEBSITE_DATA: WebsiteSettings = {
  title: 'Mallorca Gardens',
  websiteURL: '',
  tagline: 'Premier Gardening Experts',
  description: '',
  excerpt: '',
  logo: {
    id: '',
    url: '',
    storagePath: ''
  },
  content: {
    hero: {
      logo: true,
      title: true,
      tagline: true,
      description: true,
      showCTA: true,
      cta: {
        text: '',
        buttonText: '',
        buttonVariant: 'none'
      },
      background: []
    },
    about: {
      title: '',
      text: '',
      showCTA: false,
      cta: {
        text: '',
        buttonText: '',
        buttonVariant: 'none'
      }
    },
    benefits: {
      title: '',
      text: '',
      cards: []
    },
    services: {
      title: '',
      text: '',
      cards: []
    },
    location: {
      title: '',
      text: '',
      showCTA: false,
      cta: {
        text: '',
        buttonText: '',
        buttonVariant: 'none'
      }
    },
    gallery: {
      title: '',
      text: '',
      projects: []
    },
    testimonials: {
      title: '',
      text: '',
      clients: []
    },
    footer: {
      title: '',
      text: '',
      showCTA: false,
      cta: {
        text: '',
        buttonText: '',
        buttonVariant: 'none'
      }
    }
  },
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
    whatsappMessage: ''
  },
  seo: [],
  updatedAt: { seconds: 0, nanoseconds: 0 } as any
};

// We cache the promise rather than the result to handle concurrent calls
// correctly and ensure we only fetch once.
let configPromise: Promise<WebsiteSettings> | null = null;

export const getWebsiteConfig = (): Promise<WebsiteSettings> => {
  if (configPromise) {
    return configPromise;
  }

  if (!VITE_WEBSITE_CONFIG_URL) {
    console.warn('VITE_WEBSITE_CONFIG_URL is not defined in .env');
    return Promise.resolve(DEFAULT_WEBSITE_DATA);
  }

  configPromise = fetch(VITE_WEBSITE_CONFIG_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch website config');
      }
      const data = await response.json();
      
      // Merge with defaults to ensure all fields exist
      return {
        ...DEFAULT_WEBSITE_DATA,
        ...data,
        social: {
          ...DEFAULT_WEBSITE_DATA.social,
          ...data?.social
        },
        content: {
          ...DEFAULT_WEBSITE_DATA.content,
          ...data?.content
        }
      };
    })
    .catch((error) => {
      console.error('Error loading website config:', error);
      return DEFAULT_WEBSITE_DATA;
    });

  return configPromise;
};