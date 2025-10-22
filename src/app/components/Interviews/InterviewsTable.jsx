import React from 'react';
import InterviewRow from './InterviewsRow';

const InterviewTable = ({ 
  interviews, 
  onAction, 
  onView, 
  actionLoading 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Candidate</th>
              <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
              <th className="text-left p-4 font-semibold text-gray-700">Position</th>
              <th className="text-left p-4 font-semibold text-gray-700">Date & Time</th>
              <th className="text-left p-4 font-semibold text-gray-700">Interviewer</th>
              <th className="text-left p-4 font-semibold text-gray-700">Type</th>
              <th className="text-left p-4 font-semibold text-gray-700">Status</th>
              <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <InterviewRow
                key={interview.id}
                interview={interview}
                onAction={onAction}
                onView={onView}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
                isLoading={actionLoading[interview.id]}
              />
            ))}
          </tbody>
        </table>
      </div>

      {interviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No interviews found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default InterviewTable;
