import { Leaf } from 'lucide-react';

export default function PlantsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plant Encyclopedia</h1>
          <p className="text-gray-500 mt-1">Manage your plant database.</p>
        </div>
      </div>
      <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <Leaf className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Coming Soon</h3>
        <p className="mt-1 text-sm text-gray-500">The plant encyclopedia is currently under construction.</p>
      </div>
    </div>
  );
}