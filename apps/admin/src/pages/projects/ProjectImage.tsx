import React, { useState, useRef } from 'react';
import { Upload, X, Star, Plus, Minus, ChevronDown, Trash2, AlertTriangle } from 'lucide-react';
import type { ProjectImage, ImageGroup } from '@garden/shared';

interface AddImagesToGroupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  availableImages: ProjectImage[];
  currentGroupImageIds: string[]; // IDs of images already in the group
  onAddImages: (imageIds: string[]) => void;
  groupType: 'gallery' | 'slider'; // Add this prop to know the group type
}

// It's generally good practice to define helper components outside the main component
// to prevent re-creation on every render, which can impact performance.
const AddImagesToGroupPopup: React.FC<AddImagesToGroupPopupProps> = React.memo(({
  isOpen,
  onClose,
  availableImages,
  currentGroupImageIds,
  onAddImages,
  groupType, // Destructure the new prop
}) => {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(currentGroupImageIds);
  // The `selectedImageIds` state is initialized from `currentGroupImageIds` on mount.
  // When the `key` prop of `AddImagesToGroupPopup` changes, this component remounts, re-initializing the state.
  const [popupWarningMessage, setPopupWarningMessage] = useState<string | null>(null); // State for popup-specific warnings
  const popupWarningTimeoutRef = useRef<number | null>(null);

  const showPopupWarning = (message: string) => {
    setPopupWarningMessage(message);
    if (popupWarningTimeoutRef.current !== null) {
      clearTimeout(popupWarningTimeoutRef.current);
    }
    popupWarningTimeoutRef.current = setTimeout(() => {
      setPopupWarningMessage(null);
    }, 5000);
  };

  const handleCheckboxChange = (imageId: string, isChecked: boolean) => {
    setSelectedImageIds(prev =>
      isChecked ? [...prev, imageId] : prev.filter(id => id !== imageId)
    );
  };

  const handleAdd = () => {
    if (groupType === 'slider' && selectedImageIds.length > 2) {
      showPopupWarning(`Slider groups can only have a maximum of 2 images. Please deselect some images.`);
      return; // Prevent adding and keep popup open with warning
    }
    onAddImages(selectedImageIds);
    onClose();
    setSelectedImageIds([]); // Clear selected images after adding
    setPopupWarningMessage(null); // Clear any popup warning on successful add
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Images to Group</h3>
        {popupWarningMessage && ( // Render popup-specific warning
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{popupWarningMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={() => setPopupWarningMessage(null)}
                    className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-2 border rounded-md mb-4">
          {availableImages.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No images available to add.</p>
          ) : (
            availableImages.map((img) => (
              <div key={img.id} className="relative aspect-square group">
                <img
                  src={img.url}
                  alt={img.alt || 'Project image'}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedImageIds.includes(img.id)}
                    onChange={(e) => handleCheckboxChange(img.id, e.target.checked)}
                    className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
          >
            Add Selected Images
          </button>
        </div>
      </div>
    </div>
  );
}); // Memoize the popup component for performance

interface ProjectImageProps {
  existingImages: ProjectImage[]; // These are the images already saved to the project
  newPreviews: string[];
  coverImage: string;
  setCoverImage: React.Dispatch<React.SetStateAction<string>>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeExistingImage: (imageId: string) => void;
  removeNewFile: (index: number) => void; // For newly uploaded images not yet saved
  imageGroups: ImageGroup[];
  setImageGroups: React.Dispatch<React.SetStateAction<ImageGroup[]>>;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  handleImageAltChange: (imageId: string, alt: string) => void;
  handleImageCaptionChange: (imageId: string, caption: string) => void;
}

export default function ProjectImages({
  existingImages,
  newPreviews,
  coverImage,
  setCoverImage,
  handleFileSelect,
  removeExistingImage,
  removeNewFile,
  imageGroups,
  setImageGroups,
  expandedSections,
  toggleSection,
  handleImageAltChange,
  handleImageCaptionChange,
}: ProjectImageProps) {
  const [showAddImagesPopup, setShowAddImagesPopup] = useState(false); // State to control the image selection popup
  const [currentGroupToEditName, setCurrentGroupToEditName] = useState<string | null>(null); // Name of the group currently being edited in the popup
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const warningTimeoutRef = useRef<number | null>(null);

  const showWarning = (message: string) => {
    setWarningMessage(message);
    if (warningTimeoutRef.current !== null) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningTimeoutRef.current = setTimeout(() => {
      setWarningMessage(null);
    }, 5000); // Clear warning after 5 seconds
  };

  // Find the 'Featured' group. If it doesn't exist, create a default one for display purposes.
  const featuredGroup = imageGroups.find(group => group.name === 'Featured') || {
    name: 'Featured',
    description: 'Project feature images',
    type: 'gallery',
    images: [],
    order: 0, // Default order for featured group
  };
  const featuredGroupImageIds = featuredGroup.images || [];
  const imagesInFeaturedGroup = existingImages.filter(img => featuredGroupImageIds.includes(img.id));

  // Function to update any property of an image group
  const handleUpdateImageGroup = <K extends keyof ImageGroup>(groupName: string, field: K, value: ImageGroup[K]) => {
    setImageGroups((prevGroups: ImageGroup[]) => {
      // Special handling for the 'Featured' group
      if (groupName === 'Featured' && field === 'images') {
        const existingFeaturedGroupIndex = prevGroups.findIndex(group => group.name === 'Featured');
        if (existingFeaturedGroupIndex > -1) {
          return prevGroups.map(group =>
            group.name === 'Featured' ? { ...group, [field]: value, order: 0 } : group // Ensure featured group order remains 0
          );
        } else {
          // If 'Featured' group doesn't exist, create it with the images
          return [...prevGroups, { name: 'Featured', description: 'Project feature images', type: 'gallery', images: value as string[], order: 0 }];
        }
      }

      // Validation for changing group type to 'slider'
      if (field === 'type' && value === 'slider') {
        const groupToUpdate = prevGroups.find(group => group.name === groupName);
        if (groupToUpdate && (groupToUpdate.images || []).length > 2) {
          showWarning(`Cannot change group type to Slider. Please remove images from "${groupName}" until only 2 remain.`);
          return prevGroups; // Return previous state, preventing the update
        }
      }

      return prevGroups.map(group =>
        group.name === groupName ? { ...group, [field]: value } : group
      );
    });
  };

  // Function to add a new empty image group
  const handleAddImageGroup = () => {
    const newGroup: ImageGroup = {
      name: `New Group ${imageGroups.filter(g => g.name !== 'Featured').length + 1}`, // Unique default name
      description: '',
      type: 'gallery', // Default type
      images: [],
      order: imageGroups.length > 0 ? Math.max(...imageGroups.map(g => g.order || 0)) + 1 : 1, // Suggest next available order, starting from 1
    }; 
    setImageGroups((prev: ImageGroup[]) => [...prev, newGroup]);
  };

  // Function to delete an image group
  const handleDeleteImageGroup = (groupName: string) => {
    setImageGroups(prevGroups => prevGroups.filter(group => group.name !== groupName));
  };

  // Callback for the AddImagesToGroupPopup to update the images of the current group
  const handleAddImagesToCurrentGroup = (selectedImageIds: string[]) => { // No LocalImageGroup
    if (currentGroupToEditName) {
      // The validation for slider image count is now handled within AddImagesToGroupPopup.
      // This function will only be called if the validation passes in the popup.
      // Special handling for the 'Featured' group
      if (currentGroupToEditName === 'Featured') {
        handleUpdateImageGroup('Featured', 'images', selectedImageIds); // This will create the 'featured' group if it doesn't exist
      } else {
        handleUpdateImageGroup(currentGroupToEditName, 'images', selectedImageIds);
      }
    }
    setCurrentGroupToEditName(null); // Clear the editing state
    setShowAddImagesPopup(false); // Close the popup
  };

  return (
    <div className="space-y-6">
      {warningMessage && (
        <div key={warningMessage} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 sticky top-0 z-50" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{warningMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setWarningMessage(null)}
                  className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Images Accordion */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('uploadImages')}
          className="w-full flex justify-between items-center p-6 bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-800">Upload Photos</h2>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['uploadImages'] ? 'rotate-180' : ''}`}
          />
        </button>
        <div className={`px-6 pb-6 ${expandedSections['uploadImages'] ? 'block' : 'hidden'}`}>

          <div className="col-span-2 grid grid-cols-2 md:grid-cols-6 gap-4">
            <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors aspect-square">
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Photos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
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
                  className="absolute top-2 left-2 p-1 rounded-full shadow-sm transition-all hover:bg-white/80 "
                  title={img.url === coverImage ? "Cover Image" : "Set as Cover"}
                >
                  <Star
                    className={`h-5 w-5 ${img.url === coverImage ? 'text-yellow-400 fill-yellow-400' : 'text-white drop-shadow-md hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity'}`}
                  />
                </button>

                <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Saved
                </span>

                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute bottom-0 flex justify-center gap-1 w-full mx-auto py-2 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 border border-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" /> Delete Image
                </button>
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
                    className={`h-5 w-5 ${src === coverImage ? 'text-yellow-400 fill-yellow-400' : 'text-white drop-shadow-md hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity'}`}
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
          </div>
        </div>
      </div>
      {/* End Upload Images Accordion */}

      {/* Edit Images Accordion */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('editImages')}
          className="w-full flex justify-between items-center p-6 bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-800">Edit Images</h2>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['editImages'] ? 'rotate-180' : ''}`}
          />
        </button>
        <div className={`px-6 pb-6 ${expandedSections['editImages'] ? 'block' : 'hidden'}`}>
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingImages.map((img) => (
              <div key={img.id} className="">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <img
                    src={img.url}
                    alt="Existing"
                    className={`rounded-lg border object-contain aspect-squar`}
                  />
                  <div className="md:col-span-3 space-y-2">
                    <p className="block text-xs font-medium text-teal-500 mb-1">ID: {img.id}</p>
                    <input
                      type="text"
                      value={img.alt || ''}
                      onChange={(e) => handleImageAltChange(img.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Image Title"
                    />
                    <input
                      type="text"
                      value={img.caption || ''}
                      onChange={(e) => handleImageCaptionChange(img.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Image Caption"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* End Edit Images Accordion */}

      {/* Image Groups Accordion */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('imageGroups')}
          className="w-full flex justify-between items-center p-6 bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-800">Image Groups</h2>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${expandedSections['imageGroups'] ? 'rotate-180' : ''}`}
          />
        </button>
        <div className={`px-6 pb-6 ${expandedSections['imageGroups'] ? 'block' : 'hidden'}`}>
          <div className="space-y-6">
            {/* Featured Image Group - default group, cannot be deleted */}
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Group Name</label>
                  <input
                    type="text"
                    value="Featured"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    disabled
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Group Type</label>
                  <input
                    type="text"
                    value="Gallery"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    disabled
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Group Order</label>
                  <input
                    type="number"
                    value={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    disabled
                    title="Featured group order is always 0 and cannot be changed."
                  />
                </div>
                <div className="col-span-2 md:col-span-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Group Description</label>
                  <input
                    type="text"
                    value="Project feature images"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    disabled
                  />
                </div>

                <div className="col-span-2 md:col-span-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentGroupToEditName(featuredGroup.name);
                      setShowAddImagesPopup(true);
                    }}
                    className="inline-flex items-center gap-1 w-full px-3 py-3 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 border "
                  >
                    <Plus className="h-3 w-3" /> Add images to group
                  </button>
                </div>

                <div className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-6 gap-4">
                  {imagesInFeaturedGroup.map((img) => (
                    <div key={img.id} className="relative aspect-square group bg-teal-50">
                      <img
                        src={img.url}
                        alt={img.alt || 'Group image'}
                        className={`w-full h-full object-cover rounded-lg border`}
                      />
                      <button
                        type="button"
                        onClick={() => { // Remove image from featured group
                          handleUpdateImageGroup('Featured', 'images', featuredGroupImageIds.filter((id: string) => id !== img.id));
                        }}
                        className="absolute bottom-0 flex items-center justify-center gap-1 w-full mx-auto py-2 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 border border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Minus className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  ))}

                </div>
              </div>
            </div>
            
            {/* Dynamically rendered Image Groups (excluding 'Featured') */}
            {imageGroups.filter(group => group.name !== 'Featured').map((group) => (
              <div key={group.name} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-4 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Group Name</label>
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => handleUpdateImageGroup(group.name, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Group Type</label>
                    <select
                      value={group.type} 
                      onChange={(e) => handleUpdateImageGroup(group.name, 'type', e.target.value as 'gallery' | 'slider')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="gallery">Gallery</option>
                      <option value="slider">Slider</option> 
                    </select>
                  </div>
                  <div className="col-span-4 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Group Order</label>
                    <select
                      value={group.order === undefined ? '1' : group.order}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        // Ensure order is at least 1 for non-featured groups
                        handleUpdateImageGroup(group.name, 'order', isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      title="Order must be 1 or greater."
                    >
                      <option value="">Select Order</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-4 md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Group Description</label>
                    <textarea
                      rows={3}
                      value={group.description}
                      onChange={(e) => handleUpdateImageGroup(group.name, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-4">
                    <button
                      type="button"
                      onClick={() => {
                        // Set the name of the group being edited
                        setCurrentGroupToEditName(group.name);
                        setShowAddImagesPopup(true);
                      }}
                      className="inline-flex items-center gap-1 w-full px-3 py-3 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 border "
                    >
                      <Plus className="h-3 w-3" /> Add images to group
                    </button>
                  </div>

                  <div className="col-span-4 md:col-span-4 grid grid-cols-2 md:grid-cols-6 gap-4">
                    {(group.images || []).map((imageId: string) => { // Iterate over image IDs in the group
                      const img = existingImages.find(eImg => eImg.id === imageId); // Find the actual image object
                      return img ? ( // Only render if image is found
                      <div key={img.id} className="relative aspect-square group bg-gray-50">
                        <img
                          src={img.url}
                          alt={img.alt || 'Group image'}
                          className={`w-full h-full object-cover rounded-lg border`}
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateImageGroup(group.name, 'images', (group.images || []).filter((id: string) => id !== img.id))} // Remove image from group
                          className="absolute bottom-0 flex items-center justify-center gap-1 w-full mx-auto py-2 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 border border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Minus className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    ) : null; })}
                  </div>

                  <div className="col-span-4">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 w-full px-3 py-3 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 border border-red-400 "
                      onClick={() => handleDeleteImageGroup(group.name)}
                    >
                      <Trash2 className="h-3 w-3" /> Delete group
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Image Group */}
            <div className="text-center p-1 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <button
                type="button"
                onClick={handleAddImageGroup}
                className="inline-flex items-center gap-1 w-full px-6 py-6 text-sm font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100"
              >
                <Plus className="h-4 w-4" /> Add Group
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End Image Groups Accordion */}

      <AddImagesToGroupPopup
        isOpen={showAddImagesPopup}
        key={currentGroupToEditName || 'default'} // Force remount when the group being edited changes
        onClose={() => { setShowAddImagesPopup(false); setCurrentGroupToEditName(null); }}
        availableImages={existingImages}
        currentGroupImageIds={imageGroups.find(g => g.name === currentGroupToEditName)?.images || []}
        onAddImages={handleAddImagesToCurrentGroup}
        groupType={imageGroups.find(g => g.name === currentGroupToEditName)?.type || 'gallery'} // Pass the group type
      />
    </div>
  );
}