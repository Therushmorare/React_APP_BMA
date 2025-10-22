import React from 'react';

const PipelineModal = ({ selectedJob }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{selectedJob?.applicants}</div>
          <div className="text-sm text-gray-600">Total Applicants</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">8</div>
          <div className="text-sm text-gray-600">In Review</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-600">Interviews</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">1</div>
          <div className="text-sm text-gray-600">Offers</div>
        </div>
      </div>
    </div>
  );
};

export default PipelineModal;