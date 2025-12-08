import { useState, useEffect } from 'react';
import { Loader2, Save, AlertCircle, CheckCircle, Webhook, Globe, Share2, Search, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import type { WebsiteSettings, SocialLinks } from '@garden/shared';

// Default initial state matching the interface structure
const initialSettings: Partial<WebsiteSettings> = {
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
};

export default function WebsiteConfig() {
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>(initialSettings);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState('');

  // Helper to handle SEO keywords input (comma separated string <-> array)
  const [seoInput, setSeoInput] = useState('');

  // Accordion state: Track which sections are open
  // We default 'general' to true so the first section is open on mobile load
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    seo: false,
    social: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data: WebsiteSettings = await api.get('/settings/website');
        
        // Merge with initial settings to ensure nested objects (like social) exist
        setSettings({
          ...initialSettings,
          ...data,
          social: { ...initialSettings.social, ...(data.social || {}) }
        });

        if (data.seo && Array.isArray(data.seo)) {
          setSeoInput(data.seo.join(', '));
        }

        if (data.updatedAt) {
          // Handle cases where updatedAt might be a Firestore Timestamp object or a serialized date string
          // We cast to 'unknown' first to safely check types without using 'any'
          const rawDate = data.updatedAt as unknown;
          
          if (typeof rawDate === 'string') {
             setUpdatedAt(new Date(rawDate));
          } else if (typeof rawDate === 'object' && rawDate !== null && 'seconds' in rawDate) {
             // Handle Firestore Timestamp object structure { seconds, nanoseconds }
             setUpdatedAt(new Date((rawDate as { seconds: number }).seconds * 1000));
          } else {
             // Fallback
             setUpdatedAt(new Date(rawDate as string));
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load website settings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/admin/settings/website', settings);
      setSuccess('Website settings updated successfully!');
      setUpdatedAt(new Date());
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to save settings: ${message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError('');
    setPublishSuccess('');

    try {
      // The backend now generates both projects.json and websiteConfig.json
      await api.post('/admin/settings/website/publish', {});
      setPublishSuccess('Config & Projects published successfully!');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setPublishError(`Failed to publish data: ${message}`);
    } finally {
      setIsPublishing(false);
      setTimeout(() => setPublishSuccess(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Configuration</h1>
            <p className="text-gray-500">Manage global settings, SEO, and social links for your public website.</p>
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
                    <Globe className="h-5 w-5 text-blue-500" /> General Info
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                        <input
                            type="text"
                            value={settings.tagline || ''}
                            onChange={(e) => handleInputChange('tagline', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Growing the future, one plant at a time"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Content & SEO */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('seo')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Search className="h-5 w-5 text-purple-500" /> Content & SEO
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['seo'] ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['seo'] ? 'block' : 'hidden'} md:block`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                        <textarea
                            rows={3}
                            value={settings.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="A brief description of your website for search engines."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Excerpt</label>
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
                    <Share2 className="h-5 w-5 text-orange-500" /> Social Media
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

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row justify-end items-center pt-6 pb-12 gap-4 md:gap-0">
          <div className="flex items-center w-full md:w-auto justify-center md:justify-end">
            {success && <span className="text-sm text-green-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {success}</span>}
            {publishSuccess && <span className="text-sm text-blue-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {publishSuccess}</span>}
            {error && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {error}</span>}
            {publishError && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {publishError}</span>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
                href={settings.websiteURL}
                target="_blank"
                rel="noopener noreferrer"
                title="Open website URL"
                className={`flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 px-5 rounded-lg hover:bg-gray-50 font-medium ${!settings.websiteURL ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => !settings.websiteURL && e.preventDefault()}
            >
                <Globe className="h-5 w-5" />
                <span className="inline">Visit Site</span>
            </a>

            <button
                type="button"
                onClick={handlePublish}
                disabled={isSaving || isPublishing}
                className="flex items-center justify-center gap-2 bg-orange-600 text-white py-2 px-5 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
            >
                {isPublishing ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Publishing...
                </>
                ) : (
                <>
                    <Webhook className="h-5 w-5" />
                    Publish Data
                </>
                )}
            </button>
            
            <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
                {isSaving ? (
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
    </div>
  );
}