import { useState } from 'react';
import { Search, ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { WebsiteSettings } from '@garden/shared';

interface SeoSettingsProps {
  settings: WebsiteSettings;
  expanded: boolean;
  onToggle: () => void;
  onChange: (field: keyof WebsiteSettings, value: unknown) => void;
}

export function SeoSettings({ settings, expanded, onToggle, onChange }: SeoSettingsProps) {
  const [input, setInput] = useState('');

  const addKeyword = () => {
    if (!input.trim()) return;
    const current = settings.seo || [];
    onChange('seo', [...current, input.trim()]);
    setInput('');
  };

  const removeKeyword = (index: number) => {
    const current = settings.seo || [];
    onChange('seo', current.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button 
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 bg-white"
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Search className="h-5 w-5 text-teal-500" /> SEO
        </h2>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>

      <div className={`px-6 pb-6 ${expanded ? 'block' : 'hidden'}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              rows={2}
              value={settings.excerpt || ''}
              onChange={(e) => onChange('excerpt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Short text shown in the footer or intro cards."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Add a keyword..."
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {settings.seo?.map((t, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <span className="text-sm text-gray-700">{t}</span>
                  <button type="button" onClick={() => removeKeyword(i)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {(!settings.seo || settings.seo.length === 0) && (
                <p className="text-sm text-gray-400 italic">No keywords added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}