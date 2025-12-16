import { useState, useEffect, useMemo } from 'react';
import { Loader2, Save, AlertCircle, CheckCircle, Webhook, Globe, Share2, Search, ChevronDown, Clock, LayoutGrid, Dock, BadgeQuestionMark, LayoutPanelTopIcon, PinIcon, MessageCircleMore, FootprintsIcon   } from 'lucide-react';
import { api } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { WebsiteSettings, SocialLinks } from '@garden/shared';
import UnsavedChanges from '../../components/popup/UnsavedChanges';

// Default initial state matching the interface structure
const defaultSettings: WebsiteSettings = {
  title: '',
  websiteURL: '',
  tagline: '',
  description: '',
  excerpt: '',
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
  },
  seo: [],
  updatedAt: { seconds: 0, nanoseconds: 0 } as unknown as WebsiteSettings['updatedAt'],
};

function WebsiteConfigForm({ initialData, onDirtyChange }: { initialData: WebsiteSettings; onDirtyChange?: (isDirty: boolean) => void }) {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<WebsiteSettings>(initialData);
  const [showUnsavedPopup, setShowUnsavedPopup] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [publishError, setPublishError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState('');

  const [seoInput, setSeoInput] = useState(initialData.seo?.join(', ') || '');

  // Accordion state: Track which sections are open
  // We default 'general' to true so the first section is open on mobile load
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
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
    publish: false,
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
    setSeoInput(initialData.seo?.join(', ') || '');
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

  const handleSeoChange = (value: string) => {
    setSeoInput(value);
    // Split by comma and trim whitespace to create the array
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    handleInputChange('seo', keywords);
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
    setSeoInput(initialData.seo?.join(', ') || '');
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
        
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button 
                type="button"
                onClick={() => toggleSection('general')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-teal-500" /> General Info
                </h2>
                {/* Chevron only visible on mobile */}
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['general'] ? 'rotate-180' : ''}`} 
                />
            </button>
            
            {/* Content hidden on mobile if not expanded, always block on md+ */}
            <div className={`px-6 pb-6 ${expandedSections['general'] ? 'block' : 'hidden'} md:block`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website Title</label>
                        <input
                            type="text"
                            value={settings.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="My Awesome Garden"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                        <input
                            type="text"
                            value={settings.tagline || ''}
                            onChange={(e) => handleInputChange('tagline', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Growing the future, one plant at a time"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={settings.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A brief description of your website for search engines."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Public URL</label>
                        <input
                            type="url"
                            value={settings.websiteURL || ''}
                            onChange={(e) => handleInputChange('websiteURL', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="https://www.example.com"
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <a
                          href={settings.websiteURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open website URL"
                          className={`flex items-center justify-center gap-2 bg-teal-600 text-white border border-gray-300 py-2 rounded-lg hover:bg-teal-700 font-medium ${!settings.websiteURL ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={(e) => !settings.websiteURL && e.preventDefault()}
                      >
                          <Globe className="h-5 w-5" />
                          <span className="inline">Visit Site</span>
                      </a>
                    </div>
                </div>
            </div>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('hero')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Dock className="h-5 w-5 text-teal-500" /> Hero
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['hero'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['hero'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div className="md:col-span-2 flex items-center justify-between">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">
                            Show Website Title
                        </label>
                        <button
                            type="button"
                            className={`${status === 'true' ? 'bg-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                            role="switch"
                            aria-checked={status === 'true'}>
                            <span className={`${status === 'true' ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                        </button>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">
                            Show Website Tagline
                        </label>
                        <button
                            type="button"
                            className={`${status === 'true' ? 'bg-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                            role="switch"
                            aria-checked={status === 'true'}>
                            <span className={`${status === 'true' ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                        </button>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">
                            Show Website Logo
                        </label>
                        <button
                            type="button"
                            className={`${status === 'true' ? 'bg-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                            role="switch"
                            aria-checked={status === 'true'}>
                            <span className={`${status === 'true' ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                        </button>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">
                            Show Website Description
                        </label>
                        <button
                            type="button"
                            className={`${status === 'true' ? 'bg-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                            role="switch"
                            aria-checked={status === 'true'}>
                            <span className={`${status === 'true' ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                        </button>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA</label>
                        <textarea
                            rows={2}
                            value={''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A call to action statement"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Varient</label>
                        <select
                            value={'none'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            >
                            <option value="none">None</option>
                            <option value="soild">Solid</option>
                            <option value="outine">Outline</option>

                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                        <input
                            type="text"
                            value={''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Contact Us"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* About Us */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('about')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <BadgeQuestionMark className="h-5 w-5 text-teal-500" /> About Us
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['about'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['about'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={''}
                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A description of this section"
                        />
                    </div>
                </div>
            </div>
        </div>  

        {/* Services */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('services')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <LayoutPanelTopIcon className="h-5 w-5 text-teal-500" /> Services
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['services'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['services'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={''}
                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A description of this section"
                        />
                    </div>
                </div>
            </div>
        </div>  

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('benefits')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <LayoutPanelTopIcon className="h-5 w-5 text-teal-500" /> Benefits
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['benefits'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['benefits'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={''}
                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A description of this section"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('location')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <PinIcon className="h-5 w-5 text-teal-500" /> Location
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['location'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['location'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={''}
                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A description of this section"
                        />
                    </div>
                </div>
            </div>
        </div>    

        {/* Gallery */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('gallery')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-teal-500" /> Gallery
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['gallery'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['gallery'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={''}
                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A description of this section"
                        />
                    </div>
                </div>
            </div>
        </div>  

        {/* Testimonials */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('testimonials')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageCircleMore className="h-5 w-5 text-teal-500" /> Testimonials
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['testimonials'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['testimonials'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={''}
                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A description of this section"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('footer')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FootprintsIcon className="h-5 w-5 text-teal-500" /> Footer
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['footer'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['footer'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={''}
                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A description of this section"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('seo')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Search className="h-5 w-5 text-teal-500" /> SEO
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['seo'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['seo'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                        <textarea
                            rows={2}
                            value={settings.excerpt || ''}
                            onChange={(e) => handleInputChange('excerpt', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Short text shown in the footer or intro cards."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (Comma separated)</label>
                        <input
                            type="text"
                            value={seoInput}
                            onChange={(e) => handleSeoChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="garden, plants, nursery, organic"
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                            {settings.seo?.map((t, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {t}
                            </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('social')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-teal-500" /> Social Media
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['social'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['social'] ? 'block' : 'hidden'} md:block`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                        <input
                            type="url"
                            value={settings.social?.facebook || ''}
                            onChange={(e) => handleSocialChange('facebook', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                        <input
                            type="url"
                            value={settings.social?.instagram || ''}
                            onChange={(e) => handleSocialChange('instagram', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                        <input
                            type="url"
                            value={settings.social?.linkedin || ''}
                            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                        <input
                            type="text"
                            value={settings.social?.whatsapp || ''}
                            onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="+34 600 000 000"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Publish Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('publish')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-teal-600" /> Publish Status
                    {needsPublish ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Updates Pending
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Up to Date
                        </span>
                    )}
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['publish'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['publish'] ? 'block' : 'hidden'} md:block`}>
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

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row justify-end items-center pt-6 pb-12 gap-4 md:gap-0">
          <div className="flex items-center w-full md:w-auto justify-center md:justify-end">
            {success && <span className="text-sm text-green-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {success}</span>}
            {publishSuccess && <span className="text-sm text-blue-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {publishSuccess}</span>}
            {error && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {error}</span>}
            {publishError && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {publishError}</span>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
                type="submit"
                disabled={!isDirty || saveMutation.isPending}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
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
    social: { ...defaultSettings.social, ...(data.social || {}) }
  } : defaultSettings, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
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