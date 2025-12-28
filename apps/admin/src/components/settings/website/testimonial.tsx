import { MessageCircleMore, ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { WebsiteSettings, TestimonialClients, Project } from '@garden/shared';
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
  const clients = settings.content?.testimonials?.clients || [];
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

  const handleClientChange = (index: number, field: keyof TestimonialClients, value: unknown) => {
    const newClients = [...clients];
    newClients[index] = { ...newClients[index], [field]: value };
    onChange('testimonials', 'clients', newClients);
  };

  const addClient = () => {
    const newClient: TestimonialClients = {
      name: '',
      occupation: '',
      text: '',
      project: '',
      imageType: 'none',
      images: []
    };
    onChange('testimonials', 'clients', [...clients, newClient]);
  };

  const removeClient = (index: number) => {
    const newClients = clients.filter((_, i) => i !== index);
    onChange('testimonials', 'clients', newClients);
  };

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

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Clients</h3>
              <button
                type="button"
                onClick={addClient}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100"
              >
                <Plus className="h-3 w-3" /> Add Client
              </button>
            </div>
            
            <div className="space-y-4">
              {clients.map((client, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => removeClient(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={client.name}
                        onChange={(e) => handleClientChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Occupation / Role</label>
                      <input
                        type="text"
                        value={client.occupation}
                        onChange={(e) => handleClientChange(index, 'occupation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Testimonial Text</label>
                      <textarea
                        rows={2}
                        value={client.text}
                        onChange={(e) => handleClientChange(index, 'text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(!clients || clients.length === 0) && (
                <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  No testimonials added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}