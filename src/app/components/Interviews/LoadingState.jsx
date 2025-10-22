import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <Loader className="animate-spin mx-auto mb-4 text-green-700" size={32} />
      <p className="text-gray-600">Loading interviews...</p>
    </div>
  </div>
);

export default LoadingState;