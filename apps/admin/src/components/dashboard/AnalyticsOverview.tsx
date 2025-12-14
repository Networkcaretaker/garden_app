import { BarChart3, Users, Eye, TrendingUp } from 'lucide-react';

export function AnalyticsOverview() {
  const stats = [
    { label: 'Total Views', value: '12,345', change: '+12%', icon: Eye },
    { label: 'Unique Visitors', value: '5,678', change: '+8%', icon: Users },
    { label: 'Project Views', value: '8,901', change: '+24%', icon: BarChart3 },
    { label: 'Engagement Rate', value: '15%', change: '+2%', icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-full text-teal-600">
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stat.change}</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}