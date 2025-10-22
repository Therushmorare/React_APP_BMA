"use client"

import React, { useMemo } from 'react';
import { ChevronUp, ChevronDown, Eye, Trash2, Loader, Mail, Phone } from 'lucide-react';

const ApplicationRow = React.memo(({ 
  application, 
  onAction, 
  onView, 
  getStatusColor, 
  isLoading 
}) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td className="p-3">
      <span className="font-mono text-sm font-medium text-gray-900">{application.applicationId}</span>
    </td>

    <td className="p-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <img
            src={application.avatar}
            alt={application.candidateName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(application.candidateName)}&background=22c55e&color=ffffff&size=128`;
            }}
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{application.candidateName}</h4>
        </div>
      </div>
    </td>

    <td className="p-3">
      <div className="text-xs text-gray-700">
        <div className="flex items-center mb-1">
          <Mail size={12} className="mr-1" />
          <span className="truncate">{application.email}</span>
        </div>
        <div className="flex items-center">
          <Phone size={12} className="mr-1" />
          <span>{application.phone}</span>
        </div>
      </div>
    </td>

    <td className="p-3">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
        {application.status}
      </span>
    </td>

    <td className="p-3">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(application)}
          className="p-1.5 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
          title="View application details"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onAction(application.id, 'delete')}
          disabled={isLoading}
          className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          title="Delete application"
        >
          {isLoading ? <Loader className="animate-spin" size={16} /> : <Trash2 size={16} />}
        </button>
      </div>
    </td>
  </tr>
));

const ApplicationsTable = ({ 
  applications, 
  sortConfig, 
  onSort, 
  onApplicationAction, 
  onViewApplication, 
  actionLoading = {},
  onClearFilters 
}) => {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-gray-100 text-gray-800';
      case 'Screening': return 'bg-yellow-100 text-yellow-800';
      case 'Interview': return 'bg-blue-100 text-blue-800';
      case 'Offer': return 'bg-purple-100 text-purple-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-green-600" /> : 
      <ChevronDown className="w-4 h-4 text-green-600" />;
  };

  const applicationRows = useMemo(() => {
    return applications.map((application) => (
      <ApplicationRow
        key={application.id}
        application={application}
        onAction={onApplicationAction}
        onView={onViewApplication}
        getStatusColor={getStatusColor}
        isLoading={actionLoading[application.id]}
      />
    ));
  }, [applications, actionLoading, onApplicationAction, onViewApplication]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('applicationId')}
              >
                <div className="flex items-center space-x-1">
                  <span>Application ID</span>
                  <SortIcon columnKey="applicationId" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('candidateName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Candidate</span>
                  <SortIcon columnKey="candidateName" />
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
              <th 
                className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationRows}
          </tbody>
        </table>
      </div>

      {/* No Results */}
      {applications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No applications found matching your criteria</p>
          <button
            onClick={onClearFilters}
            className="text-green-600 hover:text-green-800"
          >
            Clear filters to see all applications
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;