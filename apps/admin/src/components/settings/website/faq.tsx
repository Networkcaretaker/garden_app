import { HelpCircle, ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { WebsiteSettings } from '@garden/shared';

export interface FaqQuestions {
  question: string;
  answer: string; // Keeping your spelling from the interface provided
}

export interface FaqContent {
  title: string;
  text: string;
  faq: FaqQuestions[];
}

interface FaqSettingsProps {
  settings: WebsiteSettings;
  expanded: boolean;
  onToggle: () => void;
  onChange: (section: 'faq', field: string, value: unknown) => void;
}

export function FaqSettings({ settings, expanded, onToggle, onChange }: FaqSettingsProps) {
  const faqs = settings.content?.faq?.faq || [];

  const handleFaqChange = (index: number, field: keyof FaqQuestions, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    onChange('faq', 'faq', newFaqs);
  };

  const addFaq = () => {
    const newFaq: FaqQuestions = {
      question: '',
      answer: '',
    };
    onChange('faq', 'faq', [...faqs, newFaq]);
  };

  const removeFaq = (index: number) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    onChange('faq', 'faq', newFaqs);
  };

  const clearAllFaqs = () => {
    if (confirm('Are you sure you want to remove all FAQ questions?')) {
      onChange('faq', 'faq', []);
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
          <HelpCircle className="h-5 w-5 text-teal-500" /> FAQ Section
        </h2>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>

      <div className={`px-6 pb-6 ${expanded ? 'block' : 'hidden'}`}>
        <div className="space-y-4">
          {/* Header Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={settings.content?.faq?.title || ''}
              onChange={(e) => onChange('faq', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Frequently Asked Questions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intro Text</label>
            <textarea
              rows={3}
              value={settings.content?.faq?.text || ''}
              onChange={(e) => onChange('faq', 'text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="A brief description for the FAQ section"
            />
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Questions & Answers</h3>
              <div className="flex gap-2">
                {faqs.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFaqs}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" /> Remove All
                  </button>
                )}
                <button
                  type="button"
                  onClick={addFaq}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100"
                >
                  <Plus className="h-3 w-3" /> Add Question
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {faqs.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 gap-4 pr-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                        placeholder="e.g. How long does the process take?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                      <textarea
                        rows={3}
                        value={item.answer}
                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                        placeholder="Provide a detailed answer here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {faqs.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No FAQ items added yet. Click "Add Question" to start.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}