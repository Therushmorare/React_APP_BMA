import React from 'react';

const JobDetailsModal = ({ selectedJob, getStatusColor }) => {
  if (!selectedJob) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Department:</strong> {selectedJob.department}</div>
        <div><strong>Type:</strong> {selectedJob.type}</div>
        <div><strong>Location:</strong> {selectedJob.location}</div>
        <div><strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedJob.status)}`}>
            {selectedJob.status}
          </span>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Job Description</h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {selectedJob.description}
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Requirements</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Bachelor's degree in relevant field</li>
          <li>• 3+ years of experience</li>
          <li>• Strong communication skills</li>
          <li>• Team player mentality</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">Responsibilities</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Develop and maintain job postings</li>
          <li>• Collaborate with hiring managers</li>
          <li>• Screen and interview candidates</li>
          <li>• Provide feedback and recommendations</li>
        </ul>
      </div>
      <div className="text-sm text-gray-600">
        <h4 className="font-medium mb-2">Salary Range</h4>
        <p className="text-sm text-gray-600">
          {selectedJob.salaryRange ? 
            (typeof selectedJob.salaryRange === 'object' ? 
              `${selectedJob.salaryRange.currency} ${selectedJob.salaryRange.min} - ${selectedJob.salaryRange.max}` : 
              selectedJob.salaryRange
            ) : 
            'Not specified'
          }
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Benefits</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Health insurance</li>
          <li>• Paid time off</li>
          <li>• Retirement plan</li>
          <li>• Professional development opportunities</li>
        </ul>
      </div>
      <div className="text-sm text-gray-600">
        <h4 className="font-medium mb-2">Application Deadline</h4>
        <p className="text-sm text-gray-600">
          {selectedJob.applicationDeadline ? 
            new Date(selectedJob.applicationDeadline).toLocaleDateString() : 
            'No deadline set'
          }
        </p>
      </div>
    </div>
  );
};

export default JobDetailsModal;