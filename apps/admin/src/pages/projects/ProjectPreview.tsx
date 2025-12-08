import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  Edit, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Cpu,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import type { Project } from '@garden/shared';

const ProjectPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;

      try {
        const projects: Project[] = await api.get('/projects');
        const foundProject = projects.find(p => p.id === id);
        
        if (!foundProject) {
          setError('Project not found');
          return;
        }
        
        setProject(foundProject);
      } catch (err) {
        console.error(err);
        setError('Failed to load project details');
      } finally {
        setIsFetching(false);
      }
    };

    loadProject();
  }, [id]);

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Project</h2>
          <p className="text-gray-500 mb-6">{error || "Project not found."}</p>
          <button 
            onClick={() => navigate('/projects')}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </button>
        </div>
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
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {project.published ? 'Published' : 'Draft'}
              </span>
              <Link
                to={`/projects/${project.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          
          {/* Cover Image Hero */}
          <div className="relative h-64 md:h-96 w-full bg-gray-200">
            {project.coverImage ? (
              <img 
                src={project.coverImage} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-lg">No cover image</span>
              </div>
            )}
            
            {/* Overlay Gradient for Text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 md:p-8 w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    {project.location}
                  </div>
                  <div className="hidden md:block w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center capitalize">
                    <Tag className="w-4 h-4 mr-1.5" />
                    {project.category}
                  </div>
                  {project.completedDate && (
                    <>
                      <div className="hidden md:block w-1 h-1 bg-white/50 rounded-full"></div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {new Date(project.completedDate).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8">
            
            {/* Left Column: Description & Metadata */}
            <div className="lg:col-span-1 space-y-8">
              {/* Status Card */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Project Details
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status</dt>
                    <dd className="font-medium text-gray-900 capitalize flex items-center">
                      {project.status === 'active' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mr-1.5" />
                      )}
                      {project.status}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Featured</dt>
                    <dd className="font-medium text-gray-900">
                      {project.featured ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Created</dt>
                    <dd className="font-medium text-gray-900">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Project</h3>
                <div className="prose prose-green prose-sm max-w-none text-gray-600">
                  <p className="whitespace-pre-line leading-relaxed">
                    {project.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* AI Details (Conditional) */}
              {project.aiGenerated && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Cpu className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">AI Enhanced</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        This project uses AI-generated content.
                      </p>
                      {project.aiGenerated.plantIdentifications && project.aiGenerated.plantIdentifications.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Identified Plants:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.aiGenerated.plantIdentifications.map((plant, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">
                                {plant}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Gallery */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span>Gallery</span>
                <span className="text-sm font-normal text-gray-500">
                  {project.images.length} Image{project.images.length !== 1 ? 's' : ''}
                </span>
              </h3>
              
              {project.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.images.map((img) => (
                    <div key={img.id} className="group relative break-inside-avoid mb-4">
                      <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                        <img
                          src={img.url}
                          alt={img.alt || project.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {img.caption && (
                        <p className="mt-1 text-xs text-gray-500 italic truncate">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="p-3 bg-gray-100 rounded-full mb-3">
                    <Tag className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No additional images in gallery</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;