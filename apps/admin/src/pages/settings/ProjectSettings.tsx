import { useState, useEffect, useMemo } from 'react';
import { Loader2, Save, AlertCircle, CheckCircle, Settings, Tags, ChevronDown, Plus, X, Edit2, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectSettings } from '@garden/shared';
import UnsavedChanges from '../../components/popup/UnsavedChanges';

const defaultSettings: ProjectSettings = {
  categories: [],
  tags: [],
  updatedAt: { seconds: 0, nanoseconds: 0 } as unknown as ProjectSettings['updatedAt'],
};

// Helper component to manage a list of strings (add, edit, delete)
function TaxonomyManager({ 
  title, 
  items, 
  onChange 
}: { 
  title: string; 
  items: string[]; 
  onChange: (newItems: string[]) => void; 
}) {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem('');
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const startEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = (index: number) => {
    if (!editValue.trim()) return;
    const updated = [...items];
    updated[index] = editValue.trim();
    onChange(updated);
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <div className="mb-6 last:mb-0">
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      
      {/* Add New Item */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
          placeholder={`Add new ${title.toLowerCase().slice(0, -1)}...`}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newItem.trim()}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic">No {title.toLowerCase()} added yet.</p>
        )}
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border border-gray-200 group">
            {editingIndex === index ? (
              <div className="flex flex-1 gap-2 items-center">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  autoFocus
                />
                <button type="button" onClick={() => saveEdit(index)} className="text-green-600 hover:text-green-700">
                  <Check className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setEditingIndex(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm text-gray-700">{item}</span>
                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => startEdit(index, item)} className="text-blue-500 hover:text-blue-700">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectSettingsForm({ initialData, onDirtyChange }: { initialData: ProjectSettings; onDirtyChange?: (isDirty: boolean) => void }) {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<ProjectSettings>(initialData);
  const [showUnsavedPopup, setShowUnsavedPopup] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: false,
    taxonomies: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sync state with initialData when it changes
  useEffect(() => {
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

  // Parse date for display from props (updates when parent refetches)
  const getDisplayDate = (val: unknown): Date | null => {
    if (!val) return null;
    if (typeof val === 'string') return new Date(val);
    if (typeof val === 'object' && val !== null && 'seconds' in val) {
      return new Date((val as { seconds: number }).seconds * 1000);
    }
    return null;
  };
  const updatedAt = getDisplayDate(initialData.updatedAt);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (newSettings: Partial<ProjectSettings>) => api.put('/admin/settings/projects', newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'projects'] });
      setSuccess('Project settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: Error) => {
      console.error(err);
      setError(`Failed to save settings: ${err.message}`);
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    saveMutation.mutate(settings);
  };

  const handleDiscard = () => {
    setSettings(initialData);
    setShowUnsavedPopup(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Settings</h1>
            <p className="text-gray-500">Manage global configurations for your projects.</p>
        </div>
        {updatedAt && (
            <div className="text-left md:text-right text-xs text-gray-400">
                Last updated:<br/> {updatedAt.toLocaleString()}
            </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Settings (Placeholder) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button 
                type="button"
                onClick={() => toggleSection('general')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-500" /> General Settings
                </h2>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['general'] ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`px-6 pb-6 ${expandedSections['general'] ? 'block' : 'hidden'} md:block`}>
                <p className="text-gray-500 italic">General settings coming soon.</p>
            </div>
        </div>

        {/* Taxonomies */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <button 
                type="button"
                onClick={() => toggleSection('taxonomies')}
                className="w-full flex justify-between items-center p-6 bg-white md:cursor-default"
            >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Tags className="h-5 w-5 text-blue-500" /> Taxonomies
                </h2>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform md:hidden ${expandedSections['taxonomies'] ? 'rotate-180' : ''}`} />
            </button>

            <div className={`px-6 pb-6 ${expandedSections['taxonomies'] ? 'block' : 'hidden'} md:block`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <TaxonomyManager 
                        title="Categories" 
                        items={settings.categories || []} 
                        onChange={(items) => setSettings(prev => ({ ...prev, categories: items }))} 
                    />
                    <TaxonomyManager 
                        title="Tags" 
                        items={settings.tags || []} 
                        onChange={(items) => setSettings(prev => ({ ...prev, tags: items }))} 
                    />
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row justify-end items-center pt-6 pb-12 gap-4 md:gap-0">
          <div className="flex items-center w-full md:w-auto justify-center md:justify-end">
            {success && <span className="text-sm text-green-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {success}</span>}
            {error && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {error}</span>}
          </div>
          
          <button
              type="submit"
              disabled={!isDirty || saveMutation.isPending}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium w-full md:w-auto"
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
      </form>

      <UnsavedChanges
        isOpen={showUnsavedPopup}
        onClose={() => setShowUnsavedPopup(false)}
        onDiscard={handleDiscard}
      />
    </div>
  );
}

export default function ProjectSettings({ onDirtyChange }: { onDirtyChange?: (isDirty: boolean) => void }) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['settings', 'projects'],
    queryFn: async () => {
      const data = await api.get('/settings/projects');
      return data as ProjectSettings;
    },
  });

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
        <span>{error?.message || 'Failed to load project settings.'}</span>
      </div>
    );
  }

  const safeData = data || defaultSettings;
  return <ProjectSettingsForm initialData={safeData} onDirtyChange={onDirtyChange} />;
}