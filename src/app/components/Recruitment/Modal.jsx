import React from 'react';

const Modal = ({ isOpen, onClose, title, children, position = 'right' }) => {
  if (!isOpen) return null;

  const positionClasses = position === 'right' 
    ? `fixed top-0 right-0 h-full w-2/3 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
    : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-2xl w-full mx-4';

  const formPositionClasses = position === 'form'
    ? `fixed top-0 right-0 h-full w-3/4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
    : positionClasses;

  const finalClasses = position === 'form' ? formPositionClasses : positionClasses;

  return (
    <div className={`${finalClasses} bg-white shadow-2xl z-50 ${position === 'right' || position === 'form' ? 'border-l border-gray-200' : 'rounded-lg border border-gray-200'}`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {position === 'form' ? (
            children
          ) : (
            <div className="p-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;