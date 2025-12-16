import { useState } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { api } from '../../services/api';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import type { ProjectSettings } from '@garden/shared';

interface AddTagProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (tag: string) => void;
}

export default function AddTag({ isOpen, onClose, onAdded }: AddTagProps) {
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['settings', 'projects'],
    queryFn: async () => {
      const data = await api.get('/settings/projects');
      return data as ProjectSettings;
    },
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: async (tag: string) => {
      if (!settings) throw new Error("Settings not loaded");
      
      const normalizedTag = tag.trim();
      if (settings.tags.some(t => t.toLowerCase() === normalizedTag.toLowerCase())) {
        throw new Error("Tag already exists");
      }

      const updatedSettings = {
        ...settings,
        tags: [...settings.tags, normalizedTag]
      };

      await api.put('/settings/projects', updatedSettings);
      return normalizedTag;
    },
    onSuccess: (tag) => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'projects'] });
      setNewTag('');
      onAdded(tag);
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    setError('');
    mutation.mutate(newTag);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Add New Tag</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag Name
            </label>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g. Sustainable"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !newTag.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}