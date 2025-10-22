import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
    <div className="flex items-center">
      <AlertCircle className="text-red-600 mr-2" size={20} />
      <p className="text-red-700">Error loading interviews: {error}</p>
    </div>
  </div>
);

export default ErrorState;