import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { Project } from '@garden/shared';
import { BeforeAfterSlider } from '../components/ImageSlider'; // Import the BeforeAfterSlider component
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import LeafBackground from '../components/LeafBackground';

const PROJECTS_URL = import.meta.env.VITE_PROJECTS_URL;

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    // Reset rotation state when the selected image changes or closes
    setIsRotated(false);
  }, [selectedImage]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(PROJECTS_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        const projects: Project[] = await response.json();
        const currentProject = projects.find(p => p.id === id);

        if (currentProject) {
          setProject(currentProject);
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Could not load project data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LeafBackground />
          <div className="text-center space-y-4">
            <img 
              src="/aj-logo.png" 
              alt=""
              className="mx-auto h-24 w-24 object-contain animate-pulse"
            />
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-teal-200 text-3xl font-medium">Loading Project...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Header />
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/projects" className="text-teal-600 hover:underline">
            &larr; Back to all projects
          </Link>
        </div>
      </>
    );
  }

  // Helper function to get image object from an image item (ID string or object with ID)
  const getImageFromItem = (item: string | { id: string }, allImages: Project['images']) => {
    let actualId: string | undefined;
    if (typeof item === 'string') {
      actualId = item;
    } else if (typeof item === 'object' && item !== null && 'id' in item) {
      actualId = (item as { id: string }).id;
    }
    return actualId ? allImages?.find(img => img.id === actualId) : undefined;
  };
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const isLandscape = img.naturalWidth > img.naturalHeight;
    const isPortraitView = window.innerHeight > window.innerWidth;
    
    if (isLandscape && isPortraitView) {
      setIsRotated(true);
    }
  };

  // Use the first image as the hero background if available
  const heroImage = project.images && project.images.length > 0 ? project.images[0] : null;
  // The rest of the images for the gallery
  // const galleryImages = project.images || [];

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        {heroImage ? (
          <>
            <img
              src={heroImage.url}
              alt={heroImage.alt || project.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </>
        ) : (
          <div className="h-full w-full bg-gray-900" />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        
        <div className="container mx-auto flex-grow px-4 py-12">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-teal-400 drop-shadow-lg md:text-6xl">{project.title}</h1>
            <p className="text-xl text-white/90 drop-shadow-md mb-6">{project.location}</p>
            <div>
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full object-cover rounded-xl"
              />
            </div>
            {project.description && (
              <p className="whitespace-pre-line bg-teal-800/40 border-t border-b my-12 py-6 text-lg font-thin leading-relaxed text-white/90 italic">{project.description}</p>
            )}
          </div>
          

          {/* Gallery from image url */}
          {/*
          {galleryImages.length > 0 && (
            <div className="mx-auto max-w-6xl">
              <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
                {galleryImages.map((image, index) => (
                  <div 
                    key={image.id || index} 
                    className="mb-6 break-inside-avoid cursor-pointer overflow-hidden rounded-lg shadow-xl transition-transform hover:scale-[1.02]"
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${project.title} - Image ${index + 1}`}
                      className="w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          */}

          {/* Image Groups */}
          {project.imageGroups && project.imageGroups.length > 0 && (
            <div className="mx-auto">
              {project.imageGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6 text-center">
                  {group.name === 'Featured' ? '' : (
                    <div className="bg-teal-800/40 py-4 border-t border-b mb-12">
                      <h2 className="text-3xl font-bold text-white drop-shadow-lg">{group.name}</h2>
                      {group.description && (
                        <p className="text-lg text-white/80 italic">{group.description}</p>
                      )}
                    </div>
                  )}

                  {group.type === 'slider' && group.images && group.images.length >= 2 ? (
                    (() => {
                      const allProjectImages = project.images || [];
                      const beforeImage = getImageFromItem(group.images[0], allProjectImages);
                      const afterImage = getImageFromItem(group.images[1], allProjectImages);

                      if (beforeImage?.url && afterImage?.url) {
                        return (
                          <BeforeAfterSlider
                            key={groupIndex} // Added key for the slider component
                            beforeImage={beforeImage.url}
                            afterImage={afterImage.url}
                            altText={group.name}
                            className="mt-8" // Add some top margin for spacing
                          />
                        );
                      } else {
                        console.warn(
                          `Slider group "${group.name}" is missing required images or URLs. ` +
                          `Before image ID: ${typeof group.images[0] === 'object' ? (group.images[0] as { id: string }).id : group.images[0]}, ` +
                          `After image ID: ${typeof group.images[1] === 'object' ? (group.images[1] as { id: string }).id : group.images[1]}.`
                        );
                        return null;
                      }
                    })()
                  ) : (
                    // Default to gallery if type is not slider or if conditions for slider are not met
                    group.images && group.images.length > 0 && (
                      <div className="columns-1 gap-6 sm:columns-2 lg:columns-2">
                        {group.images.map((imageItem, imageIndex) => {
                          const allProjectImages = project.images || [];
                          const image = getImageFromItem(imageItem, allProjectImages);

                          if (!image || !image.url) {
                            console.warn(
                              `Image with ID "${typeof imageItem === 'object' ? (imageItem as { id: string }).id : imageItem}" not found or missing URL in project.images for group "${group.name}".`
                            );
                            return null;
                          }

                          return (
                            <div
                              key={image.id || imageIndex}
                              className="mb-6 break-inside-avoid cursor-pointer overflow-hidden rounded-lg shadow-xl transition-transform hover:scale-[1.02]"
                              onClick={() => setSelectedImage(image.url)}
                            >
                              <img
                                src={image.url}
                                alt={image.alt || `${group.name} - Image ${imageIndex + 1}`}
                                className="w-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Testimonial */}
          {project.hasTestimonial && (
            <div className="my-16 text-center bg-teal-800/40 border-t border-b py-6">
              <p className="text-xl pb-2">⭐⭐⭐⭐⭐</p>
              <p className="whitespace-pre-line text-2xl font-thin leading-relaxed text-white italic">
                "{project.testimonial?.text}"
              </p>
              <p className="whitespace-pre-line text-xl font-bold leading-relaxed text-gray-300 italic">
                {project.testimonial?.name}<span className="text-teal-500 font-medium"> - {project.testimonial?.occupation}</span>
              </p>
            </div>
          )}
          {/* CTA BUTTON */}
          <div className="flex items-center mb-6">
            <Link
              to="/projects"
              className="inline-block rounded-full mx-auto border-2 border-teal-600 px-16 py-3 bg-teal-600 font-bold text-white transition-colors hover:bg-teal-800 hover:text-white"
            >
            Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={40} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full screen view" 
            onLoad={handleImageLoad}
            className={`rounded-lg shadow-2xl transition-transform duration-300 ${isRotated ? 'rotate-90' : 'max-h-[90vh] max-w-full'}`}
            style={isRotated ? { maxHeight: '90vw', maxWidth: '90vh' } : {}}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}