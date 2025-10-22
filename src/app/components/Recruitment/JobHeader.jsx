import React from 'react';
import { Search, Plus } from 'lucide-react';

const JobPostHeader = ({ searchQuery, setSearchQuery, handleSearch, setModalType, setShowModal }) => {
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Job Postings</h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Manage and track all your job postings and their applications.
          </p>
        </div>

        <div className="flex items-center space-x-3 ml-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setModalType('createJob');
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium"
        >
          <Plus size={16} />
          <span>Add New Post</span>
        </button>
      </div>
    </>
  );
};

export default JobPostHeader;