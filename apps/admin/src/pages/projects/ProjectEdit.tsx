import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Loader2, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { resizeImage } from '../../utils/imageResize'; 
import { uploadImage } from '../../services/storage';
import type { Project, ProjectCategory, ProjectImage } from '@garden/shared';
import DeleteProject from '../../components/popup/DeleteProject';

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Delete State
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('residential');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('inactive');
  
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projects: Project[] = await api.get('/projects');
        const project = projects.find(p => p.id === id);
        
        if (!project) {
          setError('Project not found');
          return;
        }

        setTitle(project.title);
        setDescription(project.description);
        setCategory(project.category);
        setLocation(project.location);
        setExistingImages(project.images || []);
        setStatus(project.status || 'inactive');
        
      } catch (err) {
        console.error(err);
        setError('Failed to load project details');
      } finally {
        setIsFetching(false);
      }
    };

    loadProject();
  }, [id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...files]);

      const previews = files.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter(img => img.id !== imageId));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const newUploadedImages: ProjectImage[] = [];
      const uploadPath = `project-images/${id}`;
      
      for (const file of newFiles) {
        const resizedBlob = await resizeImage(file, 1200);
        // Destructure response
        const { url, path } = await uploadImage(resizedBlob, uploadPath);
        
        newUploadedImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: url,
          storagePath: path, // Save the path
          caption: '',
          alt: '',
        });
      }

      const finalImages = [...existingImages, ...newUploadedImages];

      await api.put(`/admin/projects/${id}`, {
        title,
        description,
        category,
        location,
        status,
        images: finalImages,
      });

      navigate('/projects');
      
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to update project';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/projects/${id}`);
      navigate('/projects');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
      setShowDeletePopup(false); // Close popup so user can see error
    } finally {
      setIsDeleting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/projects')}
        className="flex items-center text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Projects
      </button>

      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>

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
              <option value="collection">Collection</option>
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
            />
          </div>

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
              className={`${status === 'active' ? 'bg-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
              role="switch"
              aria-checked={status === 'active'}>
              <span className={`${status === 'active' ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {existingImages.map((img) => (
              <div key={img.id} className="relative aspect-square group">
                <img 
                  src={img.url} 
                  alt="Existing" 
                  className="w-full h-full object-cover rounded-lg border border-gray-200" 
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-1 right-1 bg-white text-red-600 p-1.5 rounded-full shadow-sm hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Saved
                </span>
              </div>
            ))}

            {newPreviews.map((src, index) => (
              <div key={`new-${index}`} className="relative aspect-square group">
                <img 
                  src={src} 
                  alt="New Upload" 
                  className="w-full h-full object-cover rounded-lg border-2 border-green-500/50" 
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                  New
                </span>
              </div>
            ))}

            <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors aspect-square">
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Add More</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 bg-red-600 text-white py-2.5 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium mr-4"
          >
            <Trash2 className="h-5 w-5" />
            Delete Project
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-green-600 text-white py-2.5 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving Changes...
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

      <DeleteProject
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        projectTitle={title}
      />
    </div>
  );
}