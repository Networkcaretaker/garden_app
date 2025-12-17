import { useState } from 'react';
import { Globe, ChevronDown, Loader2, Image as ImageIcon } from 'lucide-react';
import type { WebsiteSettings, WebsiteImage } from '@garden/shared';
import { resizeImage } from '../../../utils/imageResize';
import { uploadImage } from '../../../services/storage';

interface GeneralSettingsProps {
    settings: WebsiteSettings;
    expanded: boolean;
    onToggle: () => void;
    onChange: (field: keyof WebsiteSettings, value: unknown) => void;
}

export function GeneralSettings({ settings, expanded, onToggle, onChange }: GeneralSettingsProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                const file = e.target.files[0];
                const resizedBlob = await resizeImage(file, 512);
                const { url, path } = await uploadImage(resizedBlob, 'website/images', 'WebsiteLogo.webp');

                const newLogo: WebsiteImage = {
                    id: 'website-logo',
                    url,
                    storagePath: path,
                    caption: settings.logo?.caption || '',
                    alt: settings.logo?.alt || settings.title || 'Website Logo',
                    width: 512,
                    height: 512
                };

                onChange('logo', newLogo);
            } catch (error) {
                console.error('Failed to upload logo:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const updateLogoDetails = (field: keyof WebsiteImage, value: string) => {
        if (settings.logo) {
            onChange('logo', { ...settings.logo, [field]: value });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button 
                type="button"
                onClick={onToggle}
                className="w-full flex justify-between items-center p-6 bg-white"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-teal-500" /> General Info
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                />
            </button>
            
            <div className={`px-6 pb-6 ${expanded ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website Title</label>
                        <input
                            type="text"
                            value={settings.title || ''}
                            onChange={(e) => onChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="My Awesome Garden"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                        <input
                            type="text"
                            value={settings.tagline || ''}
                            onChange={(e) => onChange('tagline', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Growing the future, one plant at a time"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={settings.description || ''}
                            onChange={(e) => onChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="A brief description of your website for search engines."
                        />
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website Logo</label>
                        {settings.logo?.url ? (
                            <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={settings.logo.url} 
                                            alt={settings.logo.alt || 'Logo'} 
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex-grow space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">URL (Read-only)</label>
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={settings.logo.url}
                                                className="w-full px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Storage Path (Read-only)</label>
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={settings.logo.storagePath}
                                                className="w-full px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Caption</label>
                                            <input 
                                                type="text" 
                                                value={settings.logo.caption || ''}
                                                onChange={(e) => updateLogoDetails('caption', e.target.value)}
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                                                placeholder="Logo caption"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Alt Text</label>
                                            <input 
                                                type="text" 
                                                value={settings.logo.alt || ''}
                                                onChange={(e) => updateLogoDetails('alt', e.target.value)}
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                                                placeholder="Alt text for SEO"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                                <div className="space-y-1 text-center">
                                    {isUploading ? (
                                        <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                                    ) : (
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    )}
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                                            <span>Upload a file</span>
                                            <input 
                                                type="file" 
                                                className="sr-only" 
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                disabled={isUploading}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, WebP up to 512x512px
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Public URL</label>
                        <input
                            type="url"
                            value={settings.websiteURL || ''}
                            onChange={(e) => onChange('websiteURL', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
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
    );
}