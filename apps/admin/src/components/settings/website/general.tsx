import { Globe, ChevronDown } from 'lucide-react';
import type { WebsiteSettings } from '@garden/shared';

interface GeneralSettingsProps {
    settings: WebsiteSettings;
    expanded: boolean;
    onToggle: () => void;
    onChange: (field: keyof WebsiteSettings, value: unknown) => void;
}

export function GeneralSettings({ settings, expanded, onToggle, onChange }: GeneralSettingsProps) {
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