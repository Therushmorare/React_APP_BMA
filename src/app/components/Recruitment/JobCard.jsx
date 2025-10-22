import React from 'react';
import { Building, Users, MoreVertical, Eye, BarChart3, FileText } from 'lucide-react';

const JobCard = ({ job, activeDropdown, setActiveDropdown, handleStatusChange, handleMenuClick, handleJobCardClick, getStatusColor }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
        job.status === 'Draft' ? 'cursor-pointer hover:border-green-300' : ''
      }`}
      onClick={() => handleJobCardClick(job)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Building size={14} className="mr-1" />
              {job.department}
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === job.id ? null : job.id);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <MoreVertical size={16} />
            </button>
            
            {activeDropdown === job.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleMenuClick(job, 'feedback')}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Eye size={14} className="mr-2" />
                    View Feedback
                  </button>
                  <button
                    onClick={() => handleMenuClick(job, 'pipeline')}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <BarChart3 size={14} className="mr-2" />
                    Pipeline
                  </button>
                  <button
                    onClick={() => handleMenuClick(job, 'fullJob')}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FileText size={14} className="mr-2" />
                    Full Job Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <select
              value={job.status}
              onChange={(e) => {
                e.stopPropagation();
                handleStatusChange(job.id, e.target.value);
              }}
              className={`appearance-none px-3 py-1 rounded-full text-xs font-medium border-0 outline-none cursor-pointer pr-6 ${getStatusColor(job.status)}`}
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users size={14} className="mr-1" />
            {job.applicants} applicants
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Type:</span>
            <span className="font-medium">{job.type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {job.description}
        </p>
      </div>
    </div>
  );
};

export default JobCard;