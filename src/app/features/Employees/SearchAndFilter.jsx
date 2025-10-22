import React from 'react';
import { Search, Briefcase, File } from 'lucide-react';
import { JOB_TITLES, EMPLOYEE_STATUSES, ACCOUNT_STATUSES } from '@/app/constants/employees/employeeConstants';

const SearchAndFilters = ({ searchQuery, filters, onSearchChange, onFilterChange, onSearch, onClearFilters }) => (
  <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-8">
    <div className="mb-6">
      <div className="flex items-center space-x-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
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
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
          <Briefcase size={16} className="mr-1" />
          Job Title
        </label>
        <select
          value={filters.jobTitle}
          onChange={(e) => onFilterChange('jobTitle', e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
        >
          <option value="">All Job Titles</option>
          {JOB_TITLES.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
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
          className="p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
        >
          <option value="">All Statuses</option>
          {EMPLOYEE_STATUSES.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 mb-2 flex items-center">
          <File size={16} className="mr-1" />
          Accounts
        </label>
        <select
          value={filters.account}
          onChange={(e) => onFilterChange('account', e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
        >
          <option value="">All Accounts</option>
          {ACCOUNT_STATUSES.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="mt-4 flex justify-end">
      <button
        onClick={onClearFilters}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
      >
        Clear all filters
      </button>
    </div>
  </div>
);

export default SearchAndFilters;