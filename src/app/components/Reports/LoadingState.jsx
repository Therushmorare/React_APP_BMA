import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-green-700" size={32} />
          <p className="text-gray-600">Loading recruitment reports...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;