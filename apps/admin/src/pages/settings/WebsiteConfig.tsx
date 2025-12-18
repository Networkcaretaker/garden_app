import { useState, useEffect, useMemo } from 'react';
import { Loader2, Save, AlertCircle, CheckCircle, Webhook, ChevronDown, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { WebsiteSettings, SocialLinks, Project, CallToAction } from '@garden/shared';
import UnsavedChanges from '../../components/popup/UnsavedChanges';
import { GeneralSettings } from '../../components/settings/website/general';
import { HeroSettings } from '../../components/settings/website/hero';
import { AboutSettings } from '../../components/settings/website/about';
import { ServicesSettings } from '../../components/settings/website/services';
import { BenefitsSettings } from '../../components/settings/website/benefits';
import { LocationSettings } from '../../components/settings/website/location';
import { GallerySettings } from '../../components/settings/website/gallery';
import { TestimonialSettings } from '../../components/settings/website/testimonial';
import { FooterSettings } from '../../components/settings/website/footer';
import { SeoSettings } from '../../components/settings/website/seo';
import { SocialSettings } from '../../components/settings/website/social';

// Default initial state matching the interface structure
const defaultSettings: WebsiteSettings = {
  title: '',
  websiteURL: '',
  tagline: '',
  description: '',
  excerpt: '',
  logo: { id: '', url: '', storagePath: '' },
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
    whatsappMessage: '',
  },
  seo: [],
  updatedAt: { seconds: 0, nanoseconds: 0 } as unknown as WebsiteSettings['updatedAt'],
  content: {
    hero: { logo: true, title: true, tagline: true, description: true, showCTA: false, cta: { text: '', buttonText: '', buttonVariant: 'none' } },
    about: { title: '', text: '', showCTA: false, cta: { text: '', buttonText: '', buttonVariant: 'none' } },
    benefits: { title: '', text: '', cards: [] },
    services: { title: '', text: '', cards: [] },
    location: { title: '', text: '', showCTA: false, cta: { text: '', buttonText: '', buttonVariant: 'none' } },
    gallery: { title: '', text: '', projects: [] },
    testimonials: { title: '', text: '', clients: [] },
    footer: { title: '', text: '', showCTA: false, cta: { text: '', buttonText: '', buttonVariant: 'none' } },
  },
};

function WebsiteConfigForm({ initialData, onDirtyChange }: { initialData: WebsiteSettings; onDirtyChange?: (isDirty: boolean) => void }) {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<WebsiteSettings>(initialData);
  const [showUnsavedPopup, setShowUnsavedPopup] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [publishError, setPublishError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState('');

  // Fetch projects for Gallery selection
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const data = await api.get('/projects');
      return (data || []) as Project[];
    },
  });

  // Accordion state: Track which sections are open
  // We default 'general' to true so the first section is open on mobile load
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    publish: true,
    general: false,
    content: false,
    hero: false,
    about: false,
    services: false,
    benefits: false,
    location: false,
    gallery: false,
    testimonials: false,
    footer: false,
    seo: false,
    social: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sync state with initialData when it changes (e.g. after save/refetch)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setSettings(initialData);
  }, [initialData]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updatedAt: u1, ...current } = settings;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updatedAt: u2, ...initial } = initialData;
    return JSON.stringify(current) !== JSON.stringify(initial);
  }, [settings, initialData]);

  // Notify parent of dirty state
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Warn on browser refresh/close if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Parse date for display from props
  const getDisplayDate = (val: unknown): Date | null => {
    if (!val) return null;
    if (typeof val === 'string') return new Date(val);
    if (typeof val === 'object' && val !== null && 'seconds' in val) {
      return new Date((val as { seconds: number }).seconds * 1000);
    }
    return null;
  };
  const updatedAt = getDisplayDate(initialData.updatedAt);
  const publishedAt = getDisplayDate(initialData.publishedAt);
  const projectUpdatedAt = getDisplayDate(initialData.projectUpdatedAt);

  const handleInputChange = (field: keyof WebsiteSettings, value: unknown) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: keyof SocialLinks, value: string) => {
    setSettings(prev => ({
      ...prev,
      social: {
        ...prev.social!,
        [field]: value
      }
    }));
  };

  const handleHeroCtaChange = (field: keyof CallToAction, value: string) => {
    const currentCta = settings.content.hero.cta || { text: '', buttonText: '', buttonVariant: 'none' };
    handleContentChange('hero', 'cta', { ...currentCta, [field]: value });
  };

  const handleAboutCtaChange = (field: keyof CallToAction, value: string) => {
    const currentCta = settings.content.about.cta || { text: '', buttonText: '', buttonVariant: 'none' };
    handleContentChange('about', 'cta', { ...currentCta, [field]: value });
  };

  const handleLocationCtaChange = (field: keyof CallToAction, value: string) => {
    const currentCta = settings.content.location.cta || { text: '', buttonText: '', buttonVariant: 'none' };
    handleContentChange('location', 'cta', { ...currentCta, [field]: value });
  };

  const handleFooterCtaChange = (field: keyof CallToAction, value: string) => {
    const currentCta = settings.content.footer.cta || { text: '', buttonText: '', buttonVariant: 'none' };
    handleContentChange('footer', 'cta', { ...currentCta, [field]: value });
  };

  const handleContentChange = (section: keyof WebsiteSettings['content'], field: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...prev.content[section],
          [field]: value
        }
      }
    }));
  };

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: (newSettings: Partial<WebsiteSettings>) => api.put('/admin/settings/website', newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'website'] });
      setSuccess('Website settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: Error) => {
      console.error(err);
      setError(`Failed to save settings: ${err.message}`);
    }
  });

  // Publish Mutation
  const publishMutation = useMutation({
    mutationFn: () => api.post('/admin/settings/website/publish', {}),
    onSuccess: () => {
      setPublishSuccess('Config & Projects published successfully!');
      setTimeout(() => setPublishSuccess(''), 3000);
      queryClient.invalidateQueries({ queryKey: ['settings', 'website'] });
    },
    onError: (err: Error) => {
      console.error(err);
      setPublishError(`Failed to publish data: ${err.message}`);
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    saveMutation.mutate(settings);
  };

  const handlePublish = async () => {
    setPublishError('');
    setPublishSuccess('');
    publishMutation.mutate();
  };

  const handleDiscard = () => {
    setSettings(initialData);
    setShowUnsavedPopup(false);
  };

  // Determine status
  const needsPublish = useMemo(() => {
    if (!publishedAt) return !!projectUpdatedAt || !!updatedAt;
    const projectChanged = projectUpdatedAt ? projectUpdatedAt > publishedAt : false;
    const settingsChanged = updatedAt ? updatedAt > publishedAt : false;
    return projectChanged || settingsChanged;
  }, [projectUpdatedAt, publishedAt, updatedAt]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Configuration</h1>
            <p className="text-gray-500">Manage global settings, content, SEO, and social links for your public website.</p>
        </div>
        {updatedAt && (
            <div className="text-left md:text-right text-xs text-gray-400">
                Last updated:<br/> {updatedAt.toLocaleString()}
            </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Publish Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('publish')}
                className="w-full flex justify-between items-center p-6 bg-white"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-teal-600" /> Publish Status
                    {needsPublish ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Updates Pending
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Up to Date
                        </span>
                    )}
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['publish'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['publish'] ? 'block' : 'hidden'}`}>
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Last Published: </span>
                            <span className="font-medium text-gray-900">{publishedAt ? publishedAt.toLocaleString() : 'Never'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Save className="h-4 w-4 text-gray-400" />
                            <span>Last Project Update: </span>
                            <span className="font-medium text-gray-900">{projectUpdatedAt ? projectUpdatedAt.toLocaleString() : 'Never'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Save className="h-4 w-4 text-gray-400" />
                            <span>Last Settings Update: </span>
                            <span className="font-medium text-gray-900">{updatedAt ? updatedAt.toLocaleString(): 'Never'}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handlePublish}
                        disabled={saveMutation.isPending || publishMutation.isPending}
                        className={`w-full md:w-auto flex items-center justify-center gap-2 text-white py-2 px-5 rounded-lg disabled:opacity-50 font-medium ${
                            needsPublish 
                                ? 'bg-orange-600 hover:bg-orange-700' 
                                : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                    >
                        {publishMutation.isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Publishing...
                        </>
                        ) : (
                        <>
                            <Webhook className="h-5 w-5" />
                            
                            {needsPublish ? 'Update Required' : 'Publish Data'}
                        </>
                        )}
                    </button>
                </div>
            </div>
        </div>
        
        {/* General Settings */}
        <GeneralSettings 
            settings={settings}
            expanded={expandedSections['general']}
            onToggle={() => toggleSection('general')}
            onChange={handleInputChange}
        />

        {/* Hero */}
        <HeroSettings 
            settings={settings}
            expanded={expandedSections['hero']}
            onToggle={() => toggleSection('hero')}
            onContentChange={handleContentChange}
            onCtaChange={handleHeroCtaChange}
        />

        {/* About Us */}
        <AboutSettings 
            settings={settings}
            expanded={expandedSections['about']}
            onToggle={() => toggleSection('about')}
            onContentChange={handleContentChange}
            onCtaChange={handleAboutCtaChange}
        />

        {/* Services */}
        <ServicesSettings
            settings={settings}
            expanded={expandedSections['services']}
            onToggle={() => toggleSection('services')}
            onChange={handleContentChange}
            projects={projects}
        />

        {/* Benefits */}
        <BenefitsSettings
            settings={settings}
            expanded={expandedSections['benefits']}
            onToggle={() => toggleSection('benefits')}
            onChange={handleContentChange}
            projects={projects}
        />

        {/* Location */}
        <LocationSettings
            settings={settings}
            expanded={expandedSections['location']}
            onToggle={() => toggleSection('location')}
            onContentChange={handleContentChange}
            onCtaChange={handleLocationCtaChange}
        />

        {/* Gallery */}
        <GallerySettings
            settings={settings}
            expanded={expandedSections['gallery']}
            onToggle={() => toggleSection('gallery')}
            onChange={handleContentChange}
            projects={projects}
        />

        {/* Testimonials */}
        <TestimonialSettings
            settings={settings}
            expanded={expandedSections['testimonials']}
            onToggle={() => toggleSection('testimonials')}
            onChange={handleContentChange}
        />

        {/* Footer */}
        <FooterSettings
            settings={settings}
            expanded={expandedSections['footer']}
            onToggle={() => toggleSection('footer')}
            onContentChange={handleContentChange}
            onCtaChange={handleFooterCtaChange}
        />

        {/* SEO */}
        <SeoSettings
            settings={settings}
            expanded={expandedSections['seo']}
            onToggle={() => toggleSection('seo')}
            onChange={handleInputChange}
        />

        {/* Social Media */}
        <SocialSettings
            settings={settings}
            expanded={expandedSections['social']}
            onToggle={() => toggleSection('social')}
            onChange={handleSocialChange}
        />

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row justify-end items-center pt-6 pb-12 gap-4 md:gap-0">
          <div className="flex items-center w-full md:w-auto justify-center md:justify-end">
            {success && <span className="text-sm text-teal-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {success}</span>}
            {publishSuccess && <span className="text-sm text-blue-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {publishSuccess}</span>}
            {error && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {error}</span>}
            {publishError && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {publishError}</span>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
                type="submit"
                disabled={!isDirty || saveMutation.isPending}
                className="flex items-center justify-center gap-2 bg-teal-600 text-white py-2 px-5 rounded-lg hover:bg-teal-700 disabled:opacity-50 font-medium"
            >
                {saveMutation.isPending ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                </>
                ) : (
                <>
                    <Save className="h-5 w-5" />
                    Save Changes
                </>
                )}
            </button>
          </div>
        </div>
      </form>

      <UnsavedChanges
        isOpen={showUnsavedPopup}
        onClose={() => setShowUnsavedPopup(false)}
        onDiscard={handleDiscard}
      />
    </div>
  );
}

export default function WebsiteConfig({ onDirtyChange }: { onDirtyChange?: (isDirty: boolean) => void }) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['settings', 'website'],
    queryFn: async () => {
      const data = await api.get('/settings/website');
      return data as WebsiteSettings;
    },
  });

  const safeData = useMemo(() => data ? {
    ...defaultSettings,
    ...data,
    logo: data.logo || defaultSettings.logo,
    social: { ...defaultSettings.social, ...(data.social || {}) },
    content: {
      hero: { 
        ...defaultSettings.content.hero, 
        ...(data.content?.hero || {}),
        // Ensure cta is an object, handling potential legacy string data or missing data
        cta: (data.content?.hero?.cta && typeof data.content.hero.cta === 'object') ? { ...defaultSettings.content.hero.cta, ...data.content.hero.cta } : defaultSettings.content.hero.cta
      },
      about: { 
        ...defaultSettings.content.about, 
        ...(data.content?.about || {}),
        cta: (data.content?.about?.cta && typeof data.content.about.cta === 'object') ? { ...defaultSettings.content.about.cta, ...data.content.about.cta } : defaultSettings.content.about.cta
      },
      benefits: { ...defaultSettings.content.benefits, ...(data.content?.benefits || {}) },
      services: { ...defaultSettings.content.services, ...(data.content?.services || {}) },
      location: { 
        ...defaultSettings.content.location, 
        ...(data.content?.location || {}),
        cta: (data.content?.location?.cta && typeof data.content.location.cta === 'object') ? { ...defaultSettings.content.location.cta, ...data.content.location.cta } : defaultSettings.content.location.cta
      },
      gallery: { ...defaultSettings.content.gallery, ...(data.content?.gallery || {}) },
      testimonials: { ...defaultSettings.content.testimonials, ...(data.content?.testimonials || {}) },
      footer: { 
        ...defaultSettings.content.footer, 
        ...(data.content?.footer || {}),
        cta: (data.content?.footer?.cta && typeof data.content.footer.cta === 'object') ? { ...defaultSettings.content.footer.cta, ...data.content.footer.cta } : defaultSettings.content.footer.cta
      },
    }
  } : defaultSettings, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600 gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error?.message || 'Failed to load website settings.'}</span>
      </div>
    );
  }

  return <WebsiteConfigForm initialData={safeData} onDirtyChange={onDirtyChange} />;
}