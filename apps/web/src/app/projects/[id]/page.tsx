import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/api';
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

// FIX: Type 'params' as a Promise
export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // FIX: Await the params object before accessing properties
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section / Cover Image */}
      <div className="relative h-[50vh] w-full bg-gray-900">
        {project.images && project.images.length > 0 ? (
          <>
            <Image
              src={project.images[0].url}
              alt={project.images[0].alt || project.title}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-white max-w-7xl mx-auto">
          <Link 
            href="/projects" 
            className="inline-flex items-center text-sm font-medium text-green-300 hover:text-green-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Projects
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-6 text-sm sm:text-base text-gray-200">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-400" />
              <span className="capitalize">{project.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-400" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Description */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Project</h2>
            <div className="prose prose-green max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </div>
          </div>

          {/* Gallery Grid */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.images.map((image, index) => (
                <div key={image.id || index} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group">
                  <Image
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium">Completed</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Service Type</dt>
                <dd className="mt-1 text-sm text-gray-900 font-medium capitalize">{project.category}</dd>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                  Plant identification features coming soon.
                </p>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}