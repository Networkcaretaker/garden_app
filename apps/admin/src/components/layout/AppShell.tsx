import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile for now (MVP), typically you'd add a mobile drawer here */}
      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Outlet renders the child route (e.g., Dashboard, ProjectList) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}