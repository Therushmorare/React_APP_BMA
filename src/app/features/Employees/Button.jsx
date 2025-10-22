import React from 'react';

const Button = ({ variant = 'primary', children, icon: Icon, ...props }) => {
  const variants = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      {...props}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${variants[variant]} ${props.className || ''}`}
    >
      {Icon && <Icon size={16} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;