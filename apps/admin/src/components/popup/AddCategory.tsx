import { useState } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { api } from '../../services/api';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import type { ProjectSettings } from '@garden/shared';

interface AddCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (category: string) => void;
}

export default function AddCategory({ isOpen, onClose, onAdded }: AddCategoryProps) {
  const [newCategory, setNewCategory] = useState('');
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
    mutationFn: async (category: string) => {
      if (!settings) throw new Error("Settings not loaded");
      
      const normalizedCategory = category.trim();
      if (settings.categories.some(c => c.toLowerCase() === normalizedCategory.toLowerCase())) {
        throw new Error("Category already exists");
      }

      const updatedSettings = {
        ...settings,
        categories: [...settings.categories, normalizedCategory]
      };

      await api.put('/settings/projects', updatedSettings);
      return normalizedCategory;
    },
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'projects'] });
      setNewCategory('');
      onAdded(category);
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setError('');
    mutation.mutate(newCategory);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
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
              Category Name
            </label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g. Urban Garden"
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
              disabled={mutation.isPending || !newCategory.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}