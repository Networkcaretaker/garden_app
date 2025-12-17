import { Share2, ChevronDown } from 'lucide-react';
import type { WebsiteSettings, SocialLinks } from '@garden/shared';

interface SocialSettingsProps {
  settings: WebsiteSettings;
  expanded: boolean;
  onToggle: () => void;
  onChange: (field: keyof SocialLinks, value: string) => void;
}

export function SocialSettings({ settings, expanded, onToggle, onChange }: SocialSettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button 
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 bg-white"
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-teal-500" /> Social Media
        </h2>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>

      <div className={`px-6 pb-6 ${expanded ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input
              type="url"
              value={settings.social?.facebook || ''}
              onChange={(e) => onChange('facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              value={settings.social?.instagram || ''}
              onChange={(e) => onChange('instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={settings.social?.linkedin || ''}
              onChange={(e) => onChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={settings.social?.whatsapp || ''}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="+34 600 000 000"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Message</label>
            <input
              type="text"
              value={settings.social?.whatsappMessage || ''}
              onChange={(e) => onChange('whatsappMessage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Hello, I would like to know more..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}