import React from 'react';

const FeedbackModal = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">Recent feedback from candidates and interviewers:</p>
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">Candidate Feedback</p>
          <p className="text-sm text-gray-600">"Great interview process, very transparent and professional."</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">Interviewer Feedback</p>
          <p className="text-sm text-gray-600">"Need to clarify technical requirements in job description."</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;