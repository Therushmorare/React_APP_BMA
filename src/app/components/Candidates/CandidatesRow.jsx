import React from 'react';

const CandidateRow = React.memo(({ candidate, onView, onDelete }) => {
  const getStageColor = (stage) => {
    switch (stage) {
      case 'Applied': return 'bg-gray-100 text-gray-800';
      case 'Screening': return 'bg-yellow-100 text-yellow-800';
      case 'Interview': return 'bg-blue-100 text-blue-800';
      case 'Offer': return 'bg-purple-100 text-purple-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Candidate Column */}
      <td className="p-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=22c55e&color=ffffff&size=128`;
              }}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
            <p className="text-xs text-gray-600">{candidate.email}</p>
          </div>
        </div>
      </td>

      {/* Contact Column */}
      <td className="p-3">
        <p className="text-xs text-gray-700">{candidate.phone}</p>
      </td>

      {/* Position Column */}
      <td className="p-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {candidate.position}
        </span>
      </td>

      {/* CV Column */}
      <td className="p-3">
        <button
          onClick={() => console.log('Download CV:', candidate.cv)}
          className="flex items-center space-x-1 text-xs text-green-700 hover:text-green-800 hover:underline"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{candidate.cv}</span>
        </button>
      </td>

      {/* Stage Column */}
      <td className="p-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(candidate.stage)}`}>
          {candidate.stage}
        </span>
      </td>

      {/* Actions Column */}
      <td className="p-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(candidate)}
            className="p-1.5 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
            title="View candidate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to remove this candidate?')) {
                onDelete(candidate.id);
              }
            }}
            className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            title="Remove candidate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
});

export default CandidateRow;