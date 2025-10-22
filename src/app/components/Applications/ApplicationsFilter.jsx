"use client"

import React from 'react';
import { Calendar, Users, Briefcase, Filter, Clock } from 'lucide-react';

const APPLICATIONS_PER_PAGE = 30;

const ApplicationsFilter = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  currentPage, 
  totalApplications 
}) => {
  
  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
              <option value="">All dates</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="quarter">This quarter</option>
              <option value="year">This year</option>
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
              <option value="data & analytics">Data & Analytics</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="finance">Finance</option>
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
              <option value="software engineer">Software Engineer</option>
              <option value="product manager">Product Manager</option>
              <option value="designer">UI/UX Designer</option>
              <option value="data analyst">Data Analyst</option>
              <option value="marketing">Marketing Specialist</option>
              <option value="sales">Sales Representative</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
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

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Filter size={16} className="mr-1" />
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            >
              <option value="">All types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
              <Clock size={16} className="mr-1" />
              Min Experience
            </label>
            <select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
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

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * APPLICATIONS_PER_PAGE) + 1} to {Math.min(currentPage * APPLICATIONS_PER_PAGE, totalApplications)} of {totalApplications.toLocaleString()} applications
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default ApplicationsFilter;