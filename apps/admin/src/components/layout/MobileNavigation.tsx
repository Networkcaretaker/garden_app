import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Flower, Settings } from 'lucide-react';

// In a larger app, you might want to move this to a shared configuration file
// to avoid duplication with the main Sidebar component.
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Plants', href: '/plants', icon: Flower },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNavigation() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white md:hidden">
      <div className="flex h-16 justify-around">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-green-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}