import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormField = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-xs text-red-600 flex items-center">
        <AlertCircle size={12} className="mr-1" />
        {error}
      </p>
    )}
  </div>
);

export default FormField;