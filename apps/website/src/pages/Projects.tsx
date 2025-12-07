import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '@garden/shared';

const PROJECTS_URL = import.meta.env.VITE_PROJECTS_URL;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(PROJECTS_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError('Could not load project data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20">Loading Projects...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to={`/`}>
        <h1 className="text-4xl font-bold text-center mb-2">Mallorca Gardens</h1>
      </Link>
      <p className="text-lg text-gray-600 text-center mb-12">A showcase of our recent projects.</p>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects are currently available. Please check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id} className="group block">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                {project.images && project.images.length > 0 ? (
                  <img
                    src={project.images[0].url}
                    alt={project.images[0].alt || project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>{project.title}</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 mt-1">{project.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}