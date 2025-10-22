import React from 'react';
import { Calendar, Users, Briefcase } from 'lucide-react';

const ReportsFilters = ({ filters, handleFilterChange, fetchReportData, setFilters }) => {
  const handleClearFilters = () => {
    setFilters({ dateRange: 'month', department: '', position: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <Calendar size={16} className="mr-1" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
          >
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="quarter">This quarter</option>
            <option value="year">This year</option>
            <option value="custom">Custom range</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <Users size={16} className="mr-1" />
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
          >
            <option value="">All departments</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
            <option value="design">Design</option>
            <option value="data">Data & Analytics</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <Briefcase size={16} className="mr-1" />
            Position
          </label>
          <select
            value={filters.position}
            onChange={(e) => handleFilterChange('position', e.target.value)}
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
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
        >
          Clear all filters
        </button>
        <button
          onClick={fetchReportData}
          className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm"
        >
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsFilters;