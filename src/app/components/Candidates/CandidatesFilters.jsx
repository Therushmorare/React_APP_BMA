import React from 'react';
import { Search, Calendar, Briefcase, User, Clock } from 'lucide-react';

const CandidateFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  filters, 
  onFilterChange,
  onSearch,
  totalCandidates 
}) => {
  const handleClearFilters = () => {
    setSearchQuery('');
    onFilterChange('dateRange', '');
    onFilterChange('status', '');
    onFilterChange('position', '');
    onFilterChange('type', '');
    onFilterChange('experience', '');
  };

  return (
    <>
      {/* Search Bar */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
          />
        </div>
        <button
          onClick={onSearch}
          className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium"
        >
          Search
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Date Range Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Calendar size={16} className="mr-1" />
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">All dates</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="quarter">This quarter</option>
              <option value="year">This year</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">All statuses</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Position Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Briefcase size={16} className="mr-1" />
              Position
            </label>
            <select
              value={filters.position}
              onChange={(e) => onFilterChange('position', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
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

          {/* Type Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <User size={16} className="mr-1" />
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">All types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Clock size={16} className="mr-1" />
              Min Experience
            </label>
            <select
              value={filters.experience}
              onChange={(e) => onFilterChange('experience', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">Any experience</option>
              <option value="0">0+ years</option>
              <option value="1">1+ years</option>
              <option value="2">2+ years</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
              <option value="10">10+ years</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </>
  );
};

export default CandidateFilters;