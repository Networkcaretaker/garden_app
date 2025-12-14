import { LayoutDashboard, AlertCircle, CheckCircle, ArrowRight, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { WebsiteSettings } from '@garden/shared';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', 'website'],
    queryFn: async () => {
      const data = await api.get('/settings/website');
      return data as WebsiteSettings;
    },
  });

  const getDisplayDate = (val: unknown): Date | null => {
    if (!val) return null;
    if (typeof val === 'string') return new Date(val);
    if (typeof val === 'object' && val !== null && 'seconds' in val) {
      return new Date((val as { seconds: number }).seconds * 1000);
    }
    return null;
  };

  const publishedAt = getDisplayDate(settings?.publishedAt);
  const projectUpdatedAt = getDisplayDate(settings?.projectUpdatedAt);
  const settingsUpdatedAt = getDisplayDate(settings?.updatedAt);

  const needsPublish = 
    (!publishedAt && (!!projectUpdatedAt || !!settingsUpdatedAt)) ||
    (!!publishedAt && (
      (projectUpdatedAt ? projectUpdatedAt > publishedAt : false) || 
      (settingsUpdatedAt ? settingsUpdatedAt > publishedAt : false)
    ));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to the Garden App administration.</p>
        </div>
      </div>

      {/* Website Status Section */}
      {!isLoading && settings && (
        <div className={`mb-8 p-6 rounded-lg border ${needsPublish ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {needsPublish ? (
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
              ) : (
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {needsPublish ? 'Website Update Required' : 'Website is Up to Date'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {needsPublish 
                    ? 'Changes have been made to the website settings or active projects since the last publish.' 
                    : `Last published on ${publishedAt?.toLocaleDateString()} at ${publishedAt?.toLocaleTimeString()}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {settings.websiteURL && (
                <a 
                  href={settings.websiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors bg-teal-600 border border-teal-600 text-white hover:bg-teal-700"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                </a>
              )}
              <Link 
                to="/settings?tab=website" 
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  needsPublish 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {needsPublish ? 'Update Website' : 'Settings'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <LayoutDashboard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Coming Soon</h3>
        <p className="mt-1 text-sm text-gray-500">The dashboard overview is currently under construction.</p>
      </div>
    </div>
  );
}