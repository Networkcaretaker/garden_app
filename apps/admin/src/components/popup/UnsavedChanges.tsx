import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
}

export default function UnsavedChanges({ isOpen, onClose, onDiscard }: UnsavedChangesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Unsaved Changes</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            You have unsaved changes. If you leave this page, your changes will be lost.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDiscard}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Discard Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}