import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import WebsiteConfig from './WebsiteConfig';
import ProjectSettings from './ProjectSettings';
import UnsavedChanges from '../../components/popup/UnsavedChanges';

// A placeholder for the future General settings component
function GeneralSettingsPlaceholder() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
      <p className="text-gray-500">General application settings will be managed here in the future.</p>
    </div>
  );
}
function UserSettingsPlaceholder() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">User Settings</h2>
      <p className="text-gray-500">User settings will be managed here in the future.</p>
    </div>
  );
}

export default function SettingsPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'general' | 'website' | 'projects' | 'users'>(() => {
    const tab = searchParams.get('tab');
    return (tab === 'website' || tab === 'projects') ? tab : 'general';
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedPopup, setShowUnsavedPopup] = useState(false);
  const [pendingTab, setPendingTab] = useState<'general' | 'website' | 'projects' | 'users' | null>(null);

  const tabs = [
    { id: 'general', name: 'General' },
    { id: 'website', name: 'Website' },
    { id: 'projects', name: 'Projects' },
    { id: 'users', name: 'Users' },
  ];

  const handleTabClick = (tabId: 'general' | 'website' | 'projects' | 'users') => {
    if (activeTab === tabId) return;
    
    if (isDirty) {
      setPendingTab(tabId);
      setShowUnsavedPopup(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleDiscard = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      setIsDirty(false); // Reset dirty state as we are unmounting the dirty component
    }
    setShowUnsavedPopup(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your application and website settings.</p>
      </div>

      <div>
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as 'general' | 'website' | 'projects' | 'users')}
                className={`${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'general' && <GeneralSettingsPlaceholder />}
          {activeTab === 'website' && <WebsiteConfig onDirtyChange={setIsDirty} />}
          {activeTab === 'projects' && <ProjectSettings onDirtyChange={setIsDirty} />}
          {activeTab === 'users' && <UserSettingsPlaceholder />}
        </div>
      </div>

      <UnsavedChanges
        isOpen={showUnsavedPopup}
        onClose={() => setShowUnsavedPopup(false)}
        onDiscard={handleDiscard}
      />
    </div>
  );
}