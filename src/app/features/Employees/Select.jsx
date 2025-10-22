import React from 'react';

const Select = ({ error, children, ...props }) => (
  <select
    {...props}
    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-100 outline-none ${
      error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-700'
    }`}
  >
    {children}
  </select>
);

export default Select;