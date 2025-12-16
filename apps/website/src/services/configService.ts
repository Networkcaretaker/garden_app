const VITE_WEBSITE_CONFIG_URL = import.meta.env.VITE_WEBSITE_CONFIG_URL;

export interface SocialData {
  facebook: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
}

export interface WebsiteData {
  title: string;
  tagline: string;
  description: string;
  excerpt: string;
  seoKeywords?: string[];
  social: SocialData;
}

export const DEFAULT_WEBSITE_DATA: WebsiteData = {
  title: 'Mallorca Gardens',
  tagline: 'Premier Gardening Experts',
  description: '',
  excerpt: '',
  seoKeywords: [],
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    whatsapp: ''
  }
};

// We cache the promise rather than the result to handle concurrent calls
// correctly and ensure we only fetch once.
let configPromise: Promise<WebsiteData> | null = null;

export const getWebsiteConfig = (): Promise<WebsiteData> => {
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
        title: data.title || DEFAULT_WEBSITE_DATA.title,
        tagline: data.tagline || DEFAULT_WEBSITE_DATA.tagline,
        description: data.description || DEFAULT_WEBSITE_DATA.description,
        excerpt: data.excerpt || DEFAULT_WEBSITE_DATA.excerpt,
        seoKeywords: data.seoKeywords || DEFAULT_WEBSITE_DATA.seoKeywords,
        social: {
          facebook: data.social?.facebook || DEFAULT_WEBSITE_DATA.social?.facebook,
          instagram: data.social?.instagram || DEFAULT_WEBSITE_DATA.social?.instagram,
          linkedin: data.social?.linkedin || DEFAULT_WEBSITE_DATA.social?.linkedin,
          whatsapp: data.social?.whatsapp || DEFAULT_WEBSITE_DATA.social?.whatsapp
        }
      };
    })
    .catch((error) => {
      console.error('Error loading website config:', error);
      return DEFAULT_WEBSITE_DATA;
    });

  return configPromise;
};