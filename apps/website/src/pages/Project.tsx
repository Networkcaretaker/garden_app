import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Project } from '@garden/shared';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const PROJECTS_URL = import.meta.env.VITE_PROJECTS_URL;

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
          <Link to="/projects" className="text-green-600 hover:underline">
            &larr; Back to all projects
          </Link>
        </div>
      </>
    );
  }

  // Use the first image as the hero background if available
  const heroImage = project.images && project.images.length > 0 ? project.images[0] : null;
  // The rest of the images for the gallery
  const galleryImages = project.images ? project.images.slice(1) : [];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-900">
        {heroImage && (
          <img
            src={heroImage.url}
            alt={heroImage.alt || project.title}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 p-4 text-center">
          <div>
            <h1 className="text-4xl font-bold text-white shadow-sm md:text-6xl">{project.title}</h1>
            <p className="mt-4 text-xl font-light text-white/90">{project.location}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex-grow px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Link to="/projects" className="mb-8 inline-flex items-center text-green-600 hover:underline">
            &larr; Back to all projects
          </Link>

          {project.description && (
            <div className="mb-16">
              <h2 className="mb-4 text-2xl font-bold text-green-800">About this Project</h2>
              <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700">{project.description}</p>
            </div>
          )}

          {galleryImages.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {galleryImages.map((image, index) => (
                <div key={image.id || index} className="overflow-hidden rounded-lg shadow-md transition-transform hover:scale-[1.02]">
                  <img
                    src={image.url}
                    alt={image.alt || `${project.title} - Image ${index + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}