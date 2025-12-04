import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';

export function AppShell() {
  return (
    <>
      <MobileNavigation />
      <div className="flex min-h-screen flex-col">
        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <Sidebar />
        </div>

        <div className="flex flex-1 flex-col md:pl-64">
          <main className="flex-1">
            {/* Add padding to the bottom to account for the mobile navigation bar's height (h-16 = 4rem) */}
            <div className="py-6 pb-24 md:pb-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}