"use client"

import React, { useState, useEffect } from 'react';
import { FileText, Mail, Phone, X, Star, Send } from 'lucide-react';

const ApplicationModal = ({ application, onClose, onAction }) => {
  const isOpen = !!application;
  const [activeTab, setActiveTab] = useState('application');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInterviewSchedule, setShowInterviewSchedule] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('');

  const emailTemplates = [
    { value: 'reject', label: 'Reject Application' },
    { value: 'interview', label: 'Schedule Interview' },
    { value: 'shortlist', label: 'Shortlist Candidate' },
    { value: 'onboarding', label: 'Onboarding Welcome' }
  ];

  // Sample application questions
  const applicationQuestions = [
    { question: "Why are you interested in this position?", answer: application?.coverLetter || "See cover letter below." },
    { question: "What are your salary expectations?", answer: application?.salary || "Not specified" },
    { question: "Years of experience?", answer: `${application?.experienceYears || 0} years` },
    { question: "When can you start?", answer: "2 weeks notice period" }
  ];

  useEffect(() => {
    if (application) {
      setActiveTab('application');
      setNotes('');
      setRating(0);
      setSelectedTemplate('');
    }
  }, [application?.id]);

  if (!application) return null;

  const handleDeleteApplication = () => {
    if (onAction) {
      onAction(application.id, 'delete');
    }
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleScheduleInterview = () => {
    console.log('Scheduling interview:', {
      candidateName: application.candidateName,
      date: interviewDate,
      time: interviewTime,
      type: interviewType
    });
    if (onAction) {
      onAction(application.id, 'schedule', { date: interviewDate, time: interviewTime, type: interviewType });
    }
    setShowInterviewSchedule(false);
    onClose();
  };

  const handleSubmit = () => {
    console.log('Submitting changes:', {
      applicationId: application.id,
      notes,
      rating,
      activeTab
    });
    onClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-gray-100 text-gray-800',
      'Screening': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-blue-100 text-blue-800',
      'Offer': 'bg-purple-100 text-purple-800',
      'Hired': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Sliding Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full '
      }`}>
        <div className="h-full flex backdrop-blur-sm flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Application Details</h2>
              <p className="text-sm text-gray-500 mt-1">{application.applicationId}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Profile Section */}
            <div className="text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
                <img
                  src={application.avatar}
                  alt={application.candidateName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(application.candidateName)}&background=22c55e&color=ffffff&size=128`;
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{application.candidateName}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
              <p className="text-gray-600 font-medium">{application.position}</p>
            </div>

            {/* Contact & Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-gray-700">{application.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-gray-700">{application.phone}</span>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Department:</span>
                  <p className="text-gray-900 font-medium">{application.department}</p>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <p className="text-gray-900 font-medium capitalize">{application.type}</p>
                </div>
                <div>
                  <span className="text-gray-600">Experience:</span>
                  <p className="text-gray-900 font-medium">{application.experienceYears} years</p>
                </div>
                <div>
                  <span className="text-gray-600">Salary:</span>
                  <p className="text-gray-900 font-medium">{application.salary}</p>
                </div>
                <div>
                  <span className="text-gray-600">Source:</span>
                  <p className="text-gray-900 font-medium">{application.source}</p>
                </div>
                <div>
                  <span className="text-gray-600">Applied:</span>
                  <p className="text-gray-900 font-medium">
                    {new Date(application.appliedDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-0">
                {[
                  { id: 'application', label: 'Application' },
                  { id: 'evaluation', label: 'Evaluation' },
                  { id: 'email', label: 'Email' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-700 text-green-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Application Tab */}
              {activeTab === 'application' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Application Questions</h4>
                  {applicationQuestions.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-800 mb-2">{item.question}</p>
                      <p className="text-gray-600 text-sm">{item.answer}</p>
                    </div>
                  ))}

                  {/* Skills Section */}
                  {application.skills && application.skills.length > 0 && (
                    <div className="space-y-3 mt-6">
                      <h4 className="font-medium text-gray-900">Skills & Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cover Letter */}
                  {application.coverLetter && (
                    <div className="space-y-3 mt-6">
                      <h4 className="font-medium text-gray-900">Cover Letter</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">{application.coverLetter}</p>
                      </div>
                    </div>
                  )}

                  {/* Internal Notes */}
                  {application.notes && (
                    <div className="space-y-3 mt-6">
                      <h4 className="font-medium text-gray-900">Internal Notes</h4>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <p className="text-sm text-gray-700">{application.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Evaluation Tab */}
              {activeTab === 'evaluation' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                      placeholder="Add your evaluation notes here..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`p-1 transition-colors ${
                            star <= rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          <Star size={20} fill={star <= rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {rating > 0 ? `${rating}/5` : 'No rating'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Tab */}
              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Templates
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    >
                      <option value="">Select template...</option>
                      {emailTemplates.map(template => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedTemplate && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">
                          {emailTemplates.find(t => t.value === selectedTemplate)?.label}
                        </h5>
                        <button className="flex items-center space-x-1 px-3 py-1 bg-green-700 text-white rounded text-sm hover:bg-green-800 transition-colors">
                          <Send size={14} />
                          <span>Send</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Template preview will be shown here...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => console.log('Download CV')}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} className="text-green-700" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">CV.pdf</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.appliedDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </button>
                
                <button
                  onClick={() => console.log('Download Driver License')}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} className="text-green-700" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Driver's Licence.pdf</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.appliedDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              Submit Changes
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowInterviewSchedule(true)}
                className="w-full bg-white text-green-700 border border-green-700 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-white text-red-600 border border-red-300 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Schedule Modal */}
      {showInterviewSchedule && (
        <div className="fixed inset-0 bg-blur-sm bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule Interview</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select type...</option>
                  <option value="phone">Phone Screening</option>
                  <option value="video">Video Interview</option>
                  <option value="in-person">In-Person Interview</option>
                  <option value="technical">Technical Assessment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowInterviewSchedule(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                disabled={!interviewType || !interviewDate || !interviewTime}
                className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Application</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the application from <strong>{application.candidateName}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteApplication}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationModal;