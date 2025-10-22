import React from 'react';

const EmployeeAvatar = ({ src, name, size = 'md' }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}>
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = generateAvatar(name?.split(' ')[0], name?.split(' ').slice(1).join(' '));
        }}
      />
    </div>
  );
};

export default EmployeeAvatar;