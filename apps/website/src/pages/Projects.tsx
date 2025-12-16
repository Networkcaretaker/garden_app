import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '@garden/shared';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

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
    return (
      <>
        <Header />
        <div className="text-center py-20">Loading Projects...</div>

      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center py-20 text-red-500">{error}</div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-12">
        <h1 className="mb-2 text-center text-4xl font-bold text-teal-800">Our Projects</h1>
        <p className="mb-12 text-center text-lg text-gray-600">A showcase of our recent work across Mallorca.</p>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects are currently available. Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="group block">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
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
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 mt-1">{project.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}