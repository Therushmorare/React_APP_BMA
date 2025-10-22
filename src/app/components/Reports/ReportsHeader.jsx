import React from 'react';
import { Download, Loader, AlertCircle } from 'lucide-react';

const ReportsHeader = ({ error, exporting, handleExport }) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Recruitment Reports</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          Analytics for recruitment activities across all departments and positions
        </p>
        {error && (
          <div className="mt-2 flex items-center text-amber-600 text-sm">
            <AlertCircle size={16} className="mr-1" />
            Using sample data - API connection failed
          </div>
        )}
      </div>

      <div className="ml-8 flex space-x-3">
        <button
          onClick={() => handleExport('excel')}
          disabled={exporting}
          className="flex items-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium disabled:opacity-50"
        >
          <Download size={18} />
          <span>Excel</span>
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={exporting}
          className="flex items-center space-x-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium disabled:opacity-50"
        >
          {exporting ? <Loader className="animate-spin" size={18} /> : <Download size={18} />}
          <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsHeader;