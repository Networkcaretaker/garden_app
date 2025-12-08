import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  projectTitle?: string;
}

export default function DeleteProject({ isOpen, onClose, onConfirm, isDeleting, projectTitle }: DeleteProjectProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-medium text-gray-900">"{projectTitle || 'this project'}"</span>?
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-6 ml-14">
            This action cannot be undone. The project and all its associated images will be permanently removed from your database and storage.
          </p>

          <div className="flex justify-end gap-3 bg-gray-50 -mx-6 -mb-6 p-4 border-t border-gray-100">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 min-w-[100px] transition-colors"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Project'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}