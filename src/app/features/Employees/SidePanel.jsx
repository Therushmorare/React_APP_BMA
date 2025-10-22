import React from 'react';
import { X } from 'lucide-react';


const SidePanel = ({ isOpen, onClose, title, children, width = 'w-full' }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 right-0 h-full ${width} bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SidePanel;