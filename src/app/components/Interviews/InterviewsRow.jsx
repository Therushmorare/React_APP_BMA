import React from 'react';
import { Eye, Check, Clock, Loader } from 'lucide-react';

const InterviewRow = React.memo(({ 
  interview, 
  onAction, 
  onView, 
  getStatusColor, 
  formatDate, 
  isLoading 
}) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td className="p-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={interview.avatar}
            alt={interview.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.name)}&background=22c55e&color=ffffff&size=128`;
            }}
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{interview.name}</h4>
          <p className="text-xs text-gray-600 truncate">{interview.email}</p>
        </div>
      </div>
    </td>

    <td className="p-3">
      <p className="text-xs text-gray-700">{interview.phone}</p>
    </td>

    <td className="p-3">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {interview.position}
      </span>
    </td>

    <td className="p-3">
      <div className="text-xs">
        <p className="font-medium text-gray-900">{formatDate(interview.date)}</p>
        <p className="text-gray-600">{interview.time}</p>
      </div>
    </td>

    <td className="p-3">
      <p className="text-xs text-gray-700 font-medium">{interview.interviewer}</p>
    </td>

    <td className="p-3">
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
        {interview.type}
      </span>
    </td>

    <td className="p-3">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
        {interview.status}
      </span>
    </td>

    <td className="p-3">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(interview)}
          className="p-1.5 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
          title="View details"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onAction(interview.id, 'complete')}
          disabled={isLoading || interview.status === 'Completed'}
          className="p-1.5 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Mark as completed"
        >
          {isLoading ? <Loader className="animate-spin" size={16} /> : <Check size={16} />}
        </button>
      </div>
    </td>
  </tr>
));

export default InterviewRow;