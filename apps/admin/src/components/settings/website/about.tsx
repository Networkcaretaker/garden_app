import { BadgeQuestionMark, ChevronDown } from 'lucide-react';
import type { WebsiteSettings, CallToAction, buttonVariants } from '@garden/shared';

interface AboutSettingsProps {
    settings: WebsiteSettings;
    expanded: boolean;
    onToggle: () => void;
    onContentChange: (section: 'about', field: string, value: unknown) => void;
    onCtaChange: (field: keyof CallToAction, value: string) => void;
}

export function AboutSettings({ settings, expanded, onToggle, onContentChange, onCtaChange }: AboutSettingsProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={onToggle}
                className="w-full flex justify-between items-center p-6 bg-white"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <BadgeQuestionMark className="h-5 w-5 text-teal-500" /> About Us
                </h2>
                <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                />
            </button>

            <div className={`px-6 pb-6 ${expanded ? 'block' : 'hidden'}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={settings.content?.about?.title || ''}
                            onChange={(e) => onContentChange('about', 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="A title for this section"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                        <textarea
                            rows={2}
                            value={settings.content?.about?.text || ''}
                            onChange={(e) => onContentChange('about', 'text', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="A description of this section"
                        />
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                        <label htmlFor="about-cta" className="text-sm font-medium text-gray-700">
                            Show Call to Action
                        </label>
                        <button
                            id="about-cta"
                            type="button"
                            onClick={() => onContentChange('about', 'showCTA', !settings.content?.about?.showCTA)}
                            className={`${settings.content?.about?.showCTA ? 'bg-teal-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                            role="switch"
                            aria-checked={settings.content?.about?.showCTA}>
                            <span className={`${settings.content?.about?.showCTA ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                        </button>
                    </div>

                    {settings.content?.about?.showCTA && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 mt-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                                <textarea
                                    rows={2}
                                    value={settings.content?.about?.cta?.text || ''}
                                    onChange={(e) => onCtaChange('text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                    placeholder="A call to action statement"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                    <input
                                        type="text"
                                        value={settings.content?.about?.cta?.buttonText || ''}
                                        onChange={(e) => onCtaChange('buttonText', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        placeholder="Learn More"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Variant</label>
                                    <select
                                        value={settings.content?.about?.cta?.buttonVariant || 'none'}
                                        onChange={(e) => onCtaChange('buttonVariant', e.target.value as buttonVariants)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        >
                                        <option value="solid">Solid</option>
                                        <option value="outline">Outline</option>
                                        <option value="projects">Projects</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div> 
    );
}