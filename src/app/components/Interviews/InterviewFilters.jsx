import React from 'react';
import { Search, Calendar, Briefcase, User } from 'lucide-react';

const InterviewFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  filters, 
  onFilterChange, 
  totalInterviews,
  currentPage,
  itemsPerPage
}) => {
  const handleClearFilters = () => {
    setSearchQuery('');
    onFilterChange('dateRange', '');
    onFilterChange('status', '');
    onFilterChange('position', '');
    onFilterChange('type', '');
  };

  return (
    <>
      {/* Search Bar */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search candidates, positions, or interviewers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-1" />
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">All dates</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">All statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Briefcase size={16} className="mr-1" />
              Position
            </label>
            <select
              value={filters.position}
              onChange={(e) => onFilterChange('position', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">All positions</option>
              <option value="software-engineer">Software Engineer</option>
              <option value="product-manager">Product Manager</option>
              <option value="designer">UI/UX Designer</option>
              <option value="data-analyst">Data Analyst</option>
              <option value="marketing">Marketing Specialist</option>
              <option value="sales">Sales Representative</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <User size={16} className="mr-1" />
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">All types</option>
              <option value="Internal">Internal</option>
              <option value="External">External</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalInterviews)} of {totalInterviews.toLocaleString()} interviews
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewFilters;