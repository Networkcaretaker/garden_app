import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { Project } from '@garden/shared';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

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
        <div className="text-center py-20">Loading Project...</div>
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
  const galleryImages = project.images || [];

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
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="h-full w-full bg-gray-900" />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        
        <div className="container mx-auto flex-grow px-4 py-12">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-lg md:text-6xl">{project.title}</h1>
            <p className="text-xl text-white/90 drop-shadow-md">{project.location}</p>
            {project.description && (
              <p className="whitespace-pre-line border-t border-b my-10 py-6 text-lg font-thin leading-relaxed text-white/90 italic">{project.description}</p>
            )}
          </div>

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