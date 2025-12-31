import { MessageCircleMore, ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { WebsiteSettings, Project } from '@garden/shared';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { api } from '../../../services/api';

interface TestimonialSettingsProps {
  settings: WebsiteSettings;
  expanded: boolean;
  onToggle: () => void;
  onChange: (section: 'testimonials', field: string, value: unknown) => void;
}

export function TestimonialSettings({ settings, expanded, onToggle, onChange }: TestimonialSettingsProps) {

  const selectedProjectIds = settings.content?.testimonials?.projects || [];

  const { data: allProjects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const data = await api.get('/projects');
      return (data || []) as Project[];
    },
    staleTime: 5 * 60 * 1000, // Cache projects for 5 minutes
  });

  const availableProjects = useMemo(() => {
    return allProjects?.filter(p => p.status === 'active' && p.hasTestimonial) || [];
  }, [allProjects]);

  const handleAddProject = (projectId: string) => {
    if (!projectId) return;
    if (!selectedProjectIds.includes(projectId)) {
      onChange('testimonials', 'projects', [...selectedProjectIds, projectId]);
    }
  };

  const handleRemoveProject = (projectId: string) => {
    onChange('testimonials', 'projects', selectedProjectIds.filter(id => id !== projectId));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button 
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 bg-white"
      >
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MessageCircleMore className="h-5 w-5 text-teal-500" /> Testimonials
        </h2>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
        />
      </button>

      <div className={`px-6 pb-6 ${expanded ? 'block' : 'hidden'}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={settings.content?.testimonials?.title || ''}
              onChange={(e) => onChange('testimonials', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="A title for this section"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <textarea
              rows={2}
              value={settings.content?.testimonials?.text || ''}
              onChange={(e) => onChange('testimonials', 'text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="A description of this section"
            />
          </div>

          {/* Projects for Testimonials */}
          <div className="border-t border-gray-100 pt-4 mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Projects for Testimonials</label>
            <p className="text-xs text-gray-500 mb-2">Select active projects that have testimonials to display in this section.</p>
            <select
              value=""
              onChange={(e) => handleAddProject(e.target.value)}
              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="" disabled>
                Select a project to add...
              </option>
              {availableProjects
                .filter(p => !selectedProjectIds.includes(p.id))
                .map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
            </select>
            <div className="space-y-2 mb-4">
              {selectedProjectIds.map(projectId => {
                const project = allProjects?.find(p => p.id === projectId);
                return (
                  <div key={projectId} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <span className={`text-sm font-medium ${project ? 'text-gray-700' : (!allProjects ? 'text-gray-400' : 'text-red-500')}`}>
                      {project ? <div className="flex gap-2 items-center"><Plus className="h-4 w-4 bg-teal-600 rounded-full text-white" /> {project.title}</div> : (!allProjects ? 'Loading...' : 'Unknown Project')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(projectId)}
                      className="text-gray-400 hover:text-red-500"
                      title="Remove project from testimonials"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              {(!selectedProjectIds || selectedProjectIds.length === 0) && (
                <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No projects selected for testimonials.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}