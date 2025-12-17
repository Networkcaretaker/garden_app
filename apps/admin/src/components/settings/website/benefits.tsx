import { useMemo } from 'react';
import { LayoutPanelTopIcon, ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { WebsiteSettings, ContentCard, Project } from '@garden/shared';

interface BenefitsSettingsProps {
  settings: WebsiteSettings;
  expanded: boolean;
  onToggle: () => void;
  onChange: (section: 'benefits', field: string, value: unknown) => void;
  projects: Project[] | undefined;
}

export function BenefitsSettings({ settings, expanded, onToggle, onChange, projects }: BenefitsSettingsProps) {
  const activeProjects = useMemo(() => {
    return projects?.filter(p => p.status === 'active') || [];
  }, [projects]);

  const cards = settings.content?.benefits?.cards || [];

  const handleCardChange = (index: number, field: keyof ContentCard, value: unknown) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onChange('benefits', 'cards', newCards);
  };

  const addCard = () => {
    const newCard: ContentCard = {
      title: '',
      text: '',
      image: { id: '', url: '', storagePath: '' },
      link: '',
      order: cards.length,
    };
    onChange('benefits', 'cards', [...cards, newCard]);
  };

  const removeCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    onChange('benefits', 'cards', newCards);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button 
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 bg-white"
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <LayoutPanelTopIcon className="h-5 w-5 text-teal-500" /> Benefits
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
              value={settings.content?.benefits?.title || ''}
              onChange={(e) => onChange('benefits', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="A title for this section"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <textarea
              rows={2}
              value={settings.content?.benefits?.text || ''}
              onChange={(e) => onChange('benefits', 'text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="A description of this section"
            />
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Benefit Cards</h3>
              <button
                type="button"
                onClick={addCard}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100"
              >
                <Plus className="h-3 w-3" /> Add Card
              </button>
            </div>
            
            <div className="space-y-4">
              {cards.map((card, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Card Text</label>
                      <textarea
                        rows={2}
                        value={card.text}
                        onChange={(e) => handleCardChange(index, 'text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Link Project</label>
                      <select
                        value={card.link}
                        onChange={(e) => handleCardChange(index, 'link', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="">Select a project...</option>
                        {activeProjects.map((project) => (
                          <option key={project.id} value={project.id}>{project.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Order</label>
                      <input
                        type="number"
                        value={card.order}
                        onChange={(e) => handleCardChange(index, 'order', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(!cards || cards.length === 0) && (
                <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No benefit cards added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}