import { ArrowUpRight, Eye } from 'lucide-react';

export function PopularProjects() {
  const projects = [
    { id: 1, name: 'Vegetable Garden 2024', views: 1240, status: 'Published' },
    { id: 2, name: 'Flower Bed Redesign', views: 856, status: 'Published' },
    { id: 3, name: 'Compost Setup', views: 645, status: 'Draft' },
    { id: 4, name: 'Succulent Collection', views: 432, status: 'Published' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Popular Projects</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Project Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="bg-white hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {project.name}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    {project.views}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button className="flex items-center justify-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-700 w-full">
          View Analytics <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}