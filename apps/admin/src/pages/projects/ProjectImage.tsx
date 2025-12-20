import { Upload, X, Star, Plus, Minus, ChevronDown, Trash2 } from 'lucide-react';
import type { ProjectImage } from '@garden/shared';

interface ProjectImageProps {
  existingImages: ProjectImage[];
  newFiles: File[];
  newPreviews: string[];
  coverImage: string;
  setCoverImage: React.Dispatch<React.SetStateAction<string>>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeExistingImage: (imageId: string) => void;
  removeNewFile: (index: number) => void;
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
  expandedSections,
  toggleSection,
  handleImageAltChange,
  handleImageCaptionChange,
}: ProjectImageProps) {
  return (
    <div className="space-y-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
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
                <div className="col-span-2 md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Group Description</label>
                  <textarea
                    rows={1}
                    value="Project feature images"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    disabled
                  />
                </div>

                <div className="col-span-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 w-full px-3 py-3 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 border "
                  >
                    <Plus className="h-3 w-3" /> Add images to group
                  </button>
                </div>

                <div className="col-span-2 grid grid-cols-2 md:grid-cols-6 gap-4">
                  {/* change existingImages with groupImages map */}
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative aspect-square group bg-teal-50">
                      <img
                        src={img.url}
                        alt="Existing"
                        className={`w-full h-full object-contain rounded-lg border`}
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 flex items-center justify-center gap-1 w-full mx-auto py-2 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 border border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Minus className="h-3 w-3" /> Remove Image
                      </button>
                    </div>
                  ))}

                </div>
              </div>
            </div>

            {/* New Image Group */}
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Group Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div >
                    <label className="block text-xs font-medium text-gray-500 mb-1">Group Type</label>
                    <select
                      value="gallery"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="gallery">Gallery</option>
                      <option value="slider">Slider</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Group Description</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 w-full px-3 py-3 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 border "
                    >
                      <Plus className="h-3 w-3" /> Add images to group
                    </button>
                  </div>

                  <div className="col-span-2 grid grid-cols-2 md:grid-cols-6 gap-4">

                    {/* Change existing images to images saved in the group */}
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative aspect-square group bg-teal-50">
                        <img
                          src={img.url}
                          alt="Existing"
                          className={`w-full h-full object-contain rounded-lg border`}
                        />
                        <button
                          type="button"
                          className="absolute bottom-0 flex items-center justify-center gap-1 w-full mx-auto py-2 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 border border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Minus className="h-3 w-3" /> Remove Image
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 w-full px-3 py-3 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 border border-red-400 "
                    >
                      <Trash2 className="h-3 w-3" /> Delete group
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Image Group */}
            <div className="text-center p-1 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <button
                type="button"
                className="inline-flex items-center gap-1 w-full px-6 py-6 text-sm font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100"
              >
                <Plus className="h-4 w-4" /> Add Group
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End Image Groups Accordion */}
    </div>
  );
}