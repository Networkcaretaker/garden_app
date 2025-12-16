import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Flower, Settings, LogOut } from 'lucide-react';
import { auth } from '../../services/firebase';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Plants', href: '/plants', icon: Flower },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-200">
        <div className="bg-teal-100 p-2 rounded-full">
          <Flower className="h-5 w-5 text-teal-600" />
        </div>
        <span className="font-bold text-gray-900">Garden Admin</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}