import { MessageSquare, ThumbsUp, Trash2 } from 'lucide-react';

export function RecentComments() {
  const comments = [
    { id: 1, author: 'Alice Johnson', project: 'Vegetable Garden 2024', content: 'Great tips on the tomatoes!', date: '2 hours ago' },
    { id: 2, author: 'Bob Smith', project: 'Flower Bed Redesign', content: 'What kind of soil did you use?', date: '5 hours ago' },
    { id: 3, author: 'Charlie Brown', project: 'Compost Setup', content: 'Very helpful guide.', date: '1 day ago' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recent Comments</h3>
        <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">3 New</span>
      </div>
      <div className="divide-y divide-gray-200">
        {comments.map((comment) => (
          <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                  <p className="text-xs text-gray-500">on <span className="font-medium">{comment.project}</span> • {comment.date}</p>
                  <p className="text-sm text-gray-600 mt-2">{comment.content}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 pl-12">
              <button className="text-xs flex items-center gap-1 text-gray-600 hover:text-teal-600">
                <ThumbsUp className="h-3 w-3" /> Approve
              </button>
              <button className="text-xs flex items-center gap-1 text-gray-600 hover:text-red-600">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button className="text-sm text-teal-600 font-medium hover:text-teal-700 w-full text-center">
          View All Comments
        </button>
      </div>
    </div>
  );
}