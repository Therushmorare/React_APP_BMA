import React from 'react';
import { Search, Filter } from 'lucide-react';

const JobPostsFilter = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
        />
      </div>
      <button
        onClick={onSearch}
        className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium"
      >
        Search
      </button>
    </div>
  );
};

export default JobPostsFilter;