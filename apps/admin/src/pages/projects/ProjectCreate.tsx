import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2, Plus, ArrowLeft, Save, Star } from 'lucide-react';
import { doc, collection } from "firebase/firestore";
import { db } from '../../services/firebase';
import { api } from '../../services/api';
import { resizeImage } from '../../utils/imageResize';
import { uploadImage } from '../../services/storage';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import type { ProjectCategory, ProjectImage, ProjectSettings } from '@garden/shared';
import AddCategory from '../../components/popup/AddCategory';
import AddTag from '../../components/popup/AddTag';

export default function ProjectCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('inactive');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['settings', 'projects'],
    queryFn: async () => {
      const data = await api.get('/settings/projects');
      return data as ProjectSettings;
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...newFiles]);

      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviewUrls]);

      // If no cover image is set, default to the first uploaded image
      if (!coverImage && newPreviewUrls.length > 0) {
        setCoverImage(newPreviewUrls[0]);
      }
    }
  };

  const removeImage = (index: number) => {
    const previewToRemove = previews[index];
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    if (previewToRemove === coverImage) {
      setCoverImage('');
    }
  };

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) 
      ? prev.filter(t => t !== tag)
      : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const newDocRef = doc(collection(db, 'projects'));
      const newProjectId = newDocRef.id;

      const projectImages: ProjectImage[] = [];
      const uploadPath = `project-images/${newProjectId}`;
      
      let finalCoverImage = '';

      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        const previewUrl = previews[i];

        const resizedBlob = await resizeImage(file, 1200);
        const { url, path } = await uploadImage(resizedBlob, uploadPath);
        
        if (coverImage === previewUrl) {
          finalCoverImage = url;
        }

        projectImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: url,
          storagePath: path, // Save the path
          caption: '',
          alt: '',
        });
      }

      // Fallback: If no cover image is explicitly set (or was deleted), use the first one
      if (!finalCoverImage && projectImages.length > 0) {
        finalCoverImage = projectImages[0].url;
      }

      await api.post('/admin/projects', {
        id: newProjectId,
        title,
        description,
        category,
        location,
        tags,
        status,
        coverImage: finalCoverImage,
        images: projectImages,
      });

      // Invalidate cache so the list updates immediately
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
      
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to create project';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Create Project
                  </>
                )}
              </button> 
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
        
        <div className="md:col-span-2 flex items-center justify-between">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Project Status
              <span className="block text-xs text-gray-500">
                'Active' projects are visible on the public website.
              </span>
            </label>
            <button
              type="button"
              onClick={() => setStatus(status === 'inactive' ? 'active' : 'inactive')}
              className={`${status === 'active' ? 'bg-teal-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
              role="switch"
              aria-checked={status === 'active'}>
              <span className={`${status === 'active' ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g. Modern Villa Garden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="" disabled>Select a category</option>
                {settings?.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(true)}
                className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 border border-gray-300 transition-colors"
                title="Add new category"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g. Palma, Mallorca"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe the project..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsAddTagOpen(true)}
                className="px-3 py-1 rounded-full text-sm border border-dashed border-gray-300 text-gray-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-colors flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                New
              </button>
              {settings?.tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${tags.includes(tag) ? 'bg-teal-100 text-teal-800 border-teal-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
          <p className="text-sm text-gray-500 mb-4">Click the star icon to set the cover image for the project.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative aspect-square group">
                <img 
                  src={src} 
                  alt="Preview" 
                  className={`w-full h-full object-cover rounded-lg border-2 ${src === coverImage ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-teal-500/50'}`} 
                />
                
                {/* Star / Cover Image Button */}
                <button
                  type="button"
                  onClick={() => setCoverImage(src)}
                  className="absolute top-2 left-2 p-1 rounded-full shadow-sm transition-all hover:bg-white/80"
                  title={src === coverImage ? "Cover Image" : "Set as Cover"}
                >
                  <Star 
                    className={`h-5 w-5 ${src === coverImage ? 'text-yellow-400 fill-yellow-400' : 'text-white drop-shadow-md hover:text-yellow-400'}`} 
                  />
                </button>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
                <span className="absolute bottom-2 left-2 bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                  New
                </span>
              </div>
            ))}
            
            <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors aspect-square">
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Add Photos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-end items-center pt-6 pb-12 gap-4 md:gap-0">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2.5 px-6 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white py-2.5 px-6 rounded-lg hover:bg-teal-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      <AddCategory 
        isOpen={isAddCategoryOpen} 
        onClose={() => setIsAddCategoryOpen(false)} 
        onAdded={(newCat) => setCategory(newCat)} 
      />

      <AddTag
        isOpen={isAddTagOpen}
        onClose={() => setIsAddTagOpen(false)}
        onAdded={(newTag) => toggleTag(newTag)}
      />
    </div>
  );
}