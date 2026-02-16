"use client";

import React from "react";

const APPLICATIONS_PER_PAGE = 30;

const ApplicationsFilter = ({
  filters,
  onFilterChange,
  onClearFilters,
  currentPage,
  totalApplications,
}) => {
  const handleChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={filters.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="e.g., John"
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={filters.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="e.g., Doe"
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="text"
              value={filters.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="e.g., john.doe@email.com"
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={filters.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="e.g., +27123456789"
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
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

          {/* Application ID */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-2">
              Application ID
            </label>
            <input
              type="text"
              value={filters.applicationId || ""}
              onChange={(e) => handleChange("applicationId", e.target.value)}
              placeholder="e.g., APP12345"
              className="p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
          <div className="text-sm text-gray-600">
            Showing{" "}
            {((currentPage - 1) * APPLICATIONS_PER_PAGE) + 1} to{" "}
            {Math.min(currentPage * APPLICATIONS_PER_PAGE, totalApplications || 0)} of{" "}
            {(totalApplications ?? 0).toLocaleString()} applications
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsFilter;