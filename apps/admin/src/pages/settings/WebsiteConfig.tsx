import { useState, useEffect } from 'react';
import { Loader2, Save, AlertCircle, CheckCircle, Webhook } from 'lucide-react';
import { api } from '../../services/api';
import type { WebsiteSettings } from '@garden/shared';

export default function WebsiteConfig() {
  const [websiteURL, setWebsiteURL] = useState('');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data: WebsiteSettings = await api.get('/settings/website');
        setWebsiteURL(data.websiteURL || ''); 
        if (data.updatedAt) {
          // The backend sends a string, so we convert it to a Date object
          setUpdatedAt(new Date(data.updatedAt as unknown as string));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load website settings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/admin/settings/website', { websiteURL });
      setSuccess('Website URL updated successfully!');
      setUpdatedAt(new Date()); // Update the date in the UI immediately
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to save settings: ${message}`);
    } finally {
      setIsSaving(false);
      // Hide success message after a few seconds
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError('');
    setPublishSuccess('');

    try {
      await api.post('/admin/settings/website/publish', {});
      setPublishSuccess('Website data published successfully!');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setPublishError(`Failed to publish data: ${message}`);
    } finally {
      setIsPublishing(false);
      // Hide success message after a few seconds
      setTimeout(() => setPublishSuccess(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Configuration</h1>
      <p className="text-gray-500 mb-8">Manage global settings for your public-facing website.</p>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label htmlFor="websiteURL" className="block text-sm font-medium text-gray-700 mb-1">
              Public Website URL
            </label>
            <input
              id="websiteURL"
              type="url"
              value={websiteURL}
              onChange={(e) => setWebsiteURL(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="https://www.example.com"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 mt-1">This is the primary URL for your public website.</p>
              {updatedAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Last updated: {updatedAt.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center pt-6 mt-6 border-t border-gray-100">
          {success && <span className="text-sm text-green-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {success}</span>}
          {publishSuccess && <span className="text-sm text-blue-600 flex items-center gap-2 mr-4"><CheckCircle className="h-4 w-4" /> {publishSuccess}</span>}
          {error && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {error}</span>}
          {publishError && <span className="text-sm text-red-600 flex items-center gap-2 mr-4"><AlertCircle className="h-4 w-4" /> {publishError}</span>}
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-2 bg-orange-600 text-white py-2 px-5 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium mx-4"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Webhook className="h-5 w-5" />
                Update Website
              </>
            )}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}