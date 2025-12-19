import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Loader2, Save, ArrowLeft, Trash2, Star, Eye, Plus, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { resizeImage } from '../../utils/imageResize'; 
import { uploadImage } from '../../services/storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Project, ProjectCategory, ProjectImage, ProjectSettings } from '@garden/shared';
import DeleteProject from '../../components/popup/DeleteProject';
import AddCategory from '../../components/popup/AddCategory';
import AddTag from '../../components/popup/AddTag';
import UnsavedChanges from '../../components/popup/UnsavedChanges';

export default function ProjectEdit() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const dataLoaded = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState<Project | null>(null);
  const [showUnsavedPopup, setShowUnsavedPopup] = useState(false);

  // Accordion state for Project Info tab
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    seo: false,
    testimonial: false,
  });

  const [activeTab, setActiveTab] = useState<'project-info' | 'images'>('project-info');
  // Delete State
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('inactive');
  const [coverImage, setCoverImage] = useState(''); // New state for cover image
  
  const [hasTestimonial, setHasTestimonial] = useState(false);
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialOccupation, setTestimonialOccupation] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);

  // Use useQuery to fetch data (uses cache if available)
  const { data: projects, isLoading: isFetching } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const data = await api.get('/projects');
      return (data || []) as Project[];
    },
  });

  const { data: settings } = useQuery({
    queryKey: ['settings', 'projects'],
    queryFn: async () => {
      const data = await api.get('/settings/projects');
      return data as ProjectSettings;
    },
  });

  useEffect(() => {
    if (projects && id && !dataLoaded.current) {
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
      setCoverImage(project.coverImage || '');
      setTags(project.tags || []);
      setHasTestimonial(project.hasTestimonial || false);
      setTestimonialName(project.testimonial?.name || '');
      setTestimonialOccupation(project.testimonial?.occupation || '');
      setTestimonialText(project.testimonial?.text || '');
      
      setInitialData(project);
      
      // Mark as loaded so we don't overwrite user edits if background refetch happens
      dataLoaded.current = true;
    }
  }, [projects, id]);

  // Check if form is dirty (has changes)
  const isDirty = useMemo(() => {
    if (!initialData) return false;
    if (newFiles.length > 0) return true;
    if (title !== initialData.title) return true;
    if (description !== initialData.description) return true;
    if (category !== initialData.category) return true;
    if (location !== initialData.location) return true;
    if (status !== (initialData.status || 'inactive')) return true;
    if (coverImage !== (initialData.coverImage || '')) return true;
    if (hasTestimonial !== (initialData.hasTestimonial || false)) return true;
    if (testimonialName !== (initialData.testimonial?.name || '')) return true;
    if (testimonialOccupation !== (initialData.testimonial?.occupation || '')) return true;
    if (testimonialText !== (initialData.testimonial?.text || '')) return true;
    
    // Tags comparison
    const currentTags = [...tags].sort();
    const initTags = [...(initialData.tags || [])].sort();
    if (JSON.stringify(currentTags) !== JSON.stringify(initTags)) return true;

    // Images comparison (existing only)
    if (existingImages.length !== (initialData.images || []).length) return true;
    const currentIds = existingImages.map(i => i.id).sort().join(',');
    const initIds = (initialData.images || []).map(i => i.id).sort().join(',');
    if (currentIds !== initIds) return true;

    return false;
  }, [title, description, category, location, status, tags, coverImage, hasTestimonial, testimonialName, testimonialOccupation, testimonialText, existingImages, newFiles, initialData]);

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

  // Toggle accordion section
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...files]);

      const previews = files.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeExistingImage = (imageId: string) => {
    const imageToRemove = existingImages.find(img => img.id === imageId);
    setExistingImages((prev) => prev.filter(img => img.id !== imageId));
    
    // If the removed image was the cover, clear the cover selection
    if (imageToRemove && imageToRemove.url === coverImage) {
      setCoverImage('');
    }
  };

  const removeNewFile = (index: number) => {
    const previewToRemove = newPreviews[index];
    
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    
    // If the removed file was selected as cover, clear the selection
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

  const handleBack = () => {
    if (isDirty) {
      setShowUnsavedPopup(true);
    } else {
      navigate(-1);
    }
  };

  const handleDiscard = () => {
    setShowUnsavedPopup(false);
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const newUploadedImages: ProjectImage[] = [];
      const uploadPath = `project-images/${id}`;
      
      let finalCoverImage = coverImage;

      // Upload new files
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const previewUrl = newPreviews[i]; // This is the blob URL currently in state if selected

        const resizedBlob = await resizeImage(file, 1200);
        const { url, path } = await uploadImage(resizedBlob, uploadPath);
        
        // Check if this specific new file was selected as the cover image
        if (coverImage === previewUrl) {
          finalCoverImage = url; // Update to the real remote URL
        }

        newUploadedImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: url,
          storagePath: path,
          caption: '',
          alt: '',
        });
      }

      // If no cover image is selected, default to the first available image
      const allImages = [...existingImages, ...newUploadedImages];
      if (!finalCoverImage && allImages.length > 0) {
        finalCoverImage = allImages[0].url;
      }

      const testimonialData = hasTestimonial ? {
        name: testimonialName,
        occupation: testimonialOccupation,
        text: testimonialText,
      } : undefined;


      await api.put(`/admin/projects/${id}`, {
        title,
        description,
        category,
        location,
        status,
        tags,
        coverImage: finalCoverImage,
        images: allImages,
        hasTestimonial,
        testimonial: testimonialData,
      });

      queryClient.invalidateQueries({ queryKey: ['projects'] });
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
    e.preventDefault(); 
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/projects/${id}`);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      setError(message);
      setShowDeletePopup(false); 
    } finally {
      setIsDeleting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!isDirty || isSaving}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('project-info')}
              className={`${
                activeTab === 'project-info'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Project Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`${
                activeTab === 'images'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Images
            </button>
          </nav>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm max-w-7xl mx-auto mt-4">
        {activeTab === 'project-info' && (
          <div className="space-y-6">
            {/* Project Status (kept outside accordion) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
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
            </div>

            {/* General Info Accordion */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleSection('general')}
                className="w-full flex justify-between items-center p-6 bg-white"
              >
                <h2 className="text-lg font-semibold text-gray-800">General Info</h2>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['general'] ? 'rotate-180' : ''}`} 
                />
              </button>
              <div className={`px-6 pb-6 ${expandedSections['general'] ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
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
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Accordion */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleSection('seo')}
                className="w-full flex justify-between items-center p-6 bg-white"
              >
                <h2 className="text-lg font-semibold text-gray-800">SEO (Tags)</h2>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['seo'] ? 'rotate-180' : ''}`} 
                />
              </button>
              <div className={`px-6 pb-6 ${expandedSections['seo'] ? 'block' : 'hidden'}`}>
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
            </div> {/* End SEO Accordion */}

            {/* Testimonial Accordion */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleSection('testimonial')}
                className="w-full flex justify-between items-center p-6 bg-white"
              >
                <h2 className="text-lg font-semibold text-gray-800">Testimonial</h2>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['testimonial'] ? 'rotate-180' : ''}`} 
                />
              </button>
              <div className={`px-6 pb-6 ${expandedSections['testimonial'] ? 'block' : 'hidden'}`}>
                <div className="flex items-center justify-between mb-4">
                  <label htmlFor="hasTestimonial" className="text-sm font-medium text-gray-700">
                    Include Testimonial
                    <span className="block text-xs text-gray-500">
                      Display a client testimonial for this project.
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasTestimonial(!hasTestimonial)}
                    className={`${hasTestimonial ? 'bg-teal-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                    role="switch"
                    aria-checked={hasTestimonial}>
                    <span className={`${hasTestimonial ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>

                {hasTestimonial && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={testimonialName}
                        onChange={(e) => setTestimonialName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Occupation</label>
                      <input
                        type="text"
                        value={testimonialOccupation}
                        onChange={(e) => setTestimonialOccupation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text</label>
                      <textarea
                        rows={4}
                        value={testimonialText}
                        onChange={(e) => setTestimonialText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div> {/* End Testimonial Accordion */}
          </div> 
        )}

        {activeTab === 'images' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
              <p className="text-sm text-gray-500 mb-4">Click the star icon to set the cover image for the project.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* EXISTING IMAGES */}
                {existingImages.map((img) => (
                  <div key={img.id} className="relative aspect-square group">
                    <img 
                      src={img.url} 
                      alt="Existing" 
                      className={`w-full h-full object-cover rounded-lg border ${img.url === coverImage ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'}`} 
                    />
                    
                    {/* Star / Cover Image Button */}
                    <button
                      type="button"
                      onClick={() => setCoverImage(img.url)}
                      className="absolute top-2 left-2 p-1 rounded-full shadow-sm transition-all hover:bg-white/80"
                      title={img.url === coverImage ? "Cover Image" : "Set as Cover"}
                    >
                      <Star 
                        className={`h-5 w-5 ${img.url === coverImage ? 'text-yellow-400 fill-yellow-400' : 'text-white drop-shadow-md hover:text-yellow-400'}`} 
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      className="absolute top-2 right-2 bg-white text-red-600 p-1 rounded-full shadow-sm hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Image"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Saved
                    </span>
                    <span className="absolute bottom-2 right-2 bg-teal-600 hover:bg-teal-700 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </span>
                  </div>
                ))}

                {/* NEW UPLOADS */}
                {newPreviews.map((src, index) => (
                  <div key={`new-${index}`} className="relative aspect-square group">
                    <img 
                      src={src} 
                      alt="New Upload" 
                      className={`w-full h-full object-cover rounded-lg border-2 ${src === coverImage ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-teal-500/50'}`} 
                    />
                    
                    {/* Star / Cover Image Button for New Uploads */}
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
                      onClick={() => removeNewFile(index)}
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
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row justify-end items-center pt-6 pb-12 gap-4 md:gap-0">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
                href={`/projects/${id}`}
                className={`flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 py-2 px-5 rounded-lg hover:bg-gray-50 font-medium `}
            >
                <Eye className="h-5 w-5" />
                <span className="inline">Project Preview</span>
            </a>
            <button
              onClick={handleDeleteClick}
              className="flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 px-6 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
            >
              <Trash2 className="h-5 w-5" />
              Delete Project
            </button>
            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white py-2.5 px-6 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
        </div>

      </form>

      <DeleteProject
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        projectTitle={title}
      />

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

      <UnsavedChanges
        isOpen={showUnsavedPopup}
        onClose={() => setShowUnsavedPopup(false)}
        onDiscard={handleDiscard}
      />
    </div>
  );
}