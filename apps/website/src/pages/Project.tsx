import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Project } from '@garden/shared';

const PROJECTS_URL = 'https://firebasestorage.googleapis.com/v0/b/garden-projects.firebasestorage.app/o/website%2Fprojects.json?alt=media&token=98cc611f-d64a-4610-b4de-c0f9294dac6b';

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
    return <div className="text-center py-20">Loading Project...</div>;
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/projects" className="text-green-600 hover:underline">
          &larr; Back to all projects
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/projects" className="text-green-600 hover:underline mb-8 block">
          &larr; Back to all projects
        </Link>

        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
        <p className="text-lg text-gray-500 mb-6">{project.location}</p>
        
        {project.description && (
          <p className="text-gray-700 leading-relaxed mb-10">{project.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.images && project.images.map((image, index) => (
            <div 
              key={image.id || index} 
              className={`aspect-square ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <img
                src={image.url}
                alt={image.alt || `${project.title} - Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}