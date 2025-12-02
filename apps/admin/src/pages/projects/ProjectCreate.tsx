import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2 } from 'lucide-react';
import { doc, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { api } from '../../services/api';
import { resizeImage } from '../../utils/imageResize';
import { uploadImage } from '../../services/storage';
import type { ProjectCategory, ProjectImage } from '@garden/shared';

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('residential');
  const [location, setLocation] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
      
      for (const file of selectedImages) {
        const resizedBlob = await resizeImage(file, 1200);
        // Destructure response to get url AND path
        const { url, path } = await uploadImage(resizedBlob, uploadPath);
        
        projectImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: url,
          storagePath: path, // Save the path
          caption: '',
          alt: '',
        });
      }

      await api.post('/admin/projects', {
        id: newProjectId,
        title,
        description,
        category,
        location,
        images: projectImages,
      });

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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="e.g. Modern Villa Garden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. Palma, Mallorca"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="Describe the project..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            {previews.map((src, index) => (
              <div key={index} className="relative aspect-square">
                <img src={src} alt="Preview" className="w-full h-full object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors aspect-square">
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

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Project...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}