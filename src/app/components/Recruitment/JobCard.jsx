import React from 'react';
import { Building, Users, MoreVertical, Eye, BarChart3, FileText, Trash2 } from 'lucide-react';

const JobCard = ({
  job,
  activeDropdown,
  setActiveDropdown,
  handleStatusChange,
  handleMenuClick,
  handleJobCardClick,
  getStatusColor
}) => {

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-gray-200 
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden
      ${job.status === 'Draft' ? 'cursor-pointer hover:border-green-400' : ''}`}
      onClick={() => handleJobCardClick(job)}
    >

      {/* Top Accent Line */}
      <div className="h-1 bg-gradient-to-r from-green-600 to-emerald-400" />

      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-start mb-5">

          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
              {job.title}
            </h3>

            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Building size={14} className="mr-2 opacity-70" />
              {job.department}
            </div>
          </div>

          {/* Action Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === job.id ? null : job.id);
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <MoreVertical size={18} />
            </button>

            {activeDropdown === job.id && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-20">
                <div className="py-2">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(job, 'feedback');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition"
                  >
                    <Eye size={15} className="mr-3 text-gray-500" />
                    View Feedback
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(job, 'pipeline');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition"
                  >
                    <BarChart3 size={15} className="mr-3 text-gray-500" />
                    Pipeline
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(job, 'fullJob');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition"
                  >
                    <FileText size={15} className="mr-3 text-gray-500" />
                    Full Job Post
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(job, 'deleteJob');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition"
                  >
                    <Trash2 size={15} className="mr-3 text-gray-500" />
                    Delete Job Post
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status + Applicants Row */}
        <div className="flex justify-between items-center mb-5">

          <div className="relative">
            <select
              value={job.status}
              onChange={(e) => {
                e.stopPropagation();
                handleStatusChange(job.id, e.target.value);
              }}
              className={`appearance-none px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer pr-7 shadow-sm transition ${getStatusColor(job.status)}`}
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center text-sm font-medium text-gray-600">
            <Users size={14} className="mr-2 opacity-70" />
            {job.applicants} Applicants
          </div>

        </div>

        {/* Job Info Section */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm mb-5">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Type</p>
            <p className="font-medium text-gray-800">{job.type}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Location</p>
            <p className="font-medium text-gray-800">{job.location}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Created</p>
            <p className="font-medium text-gray-800">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {job.description}
        </p>

      </div>
    </div>
  );
};

export default JobCard;