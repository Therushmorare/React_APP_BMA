import React from 'react';
import CandidateRow from './CandidatesRow';
import { ChevronUp, ChevronDown } from 'lucide-react';

const CandidateTable = ({ 
  candidates, 
  sortConfig,
  onSort,
  onViewCandidate, 
  onDeleteCandidate 
}) => {
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-green-600" /> : 
      <ChevronDown className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Candidate</span>
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
              <th 
                className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('position')}
              >
                <div className="flex items-center space-x-1">
                  <span>Position</span>
                  <SortIcon columnKey="position" />
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">CV</th>
              <th 
                className="text-left p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('stage')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon columnKey="stage" />
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                onView={onViewCandidate}
                onDelete={onDeleteCandidate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results */}
      {candidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No candidates found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;