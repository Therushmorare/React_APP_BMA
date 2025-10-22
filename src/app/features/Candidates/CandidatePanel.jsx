"use client"

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, FileText, Star, Send } from 'lucide-react';
import { multiplechoice, calculateTotalScore, getFeedback, getPerformanceLevel } from '@/app/utils/applicationQuizData';

const CandidatePanel = ({ candidate, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('application');
  const [selectedStage, setSelectedStage] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const stages = [
    'Screening', 'Interview', 'Technical Test', 'Final Interview', 'Offer', 'Hired', 'Rejected'
  ];

  const emailTemplates = [
    { value: 'reject', label: 'Reject Application' },
    { value: 'interview', label: 'Schedule Interview' },
    { value: 'shortlist', label: 'Shortlist Candidate' },
    { value: 'onboarding', label: 'Onboarding Welcome' }
  ];

  // Sample questions and answers
  const userAnswers = [
      { questionId: 1, selectedOptionId: 'a' },
      { questionId: 2, selectedOptionId: 'a' },
      { questionId: 3, selectedOptionId: 'a' },
      { questionId: 4, selectedOptionId: 'a' }
    ];
  
    const totalScore = calculateTotalScore(userAnswers);
    const performance = getPerformanceLevel(totalScore);

  useEffect(() => {
    if (isOpen && candidate) {
      setSelectedStage(candidate.stage);
      setActiveTab('application');
      setNotes('');
      setRating(0);
      setSelectedTemplate('');
    }
  }, [isOpen, candidate?.id]);

  if (!candidate) return null;

  const handleSubmit = () => {
    console.log('Submitting changes:', {
      candidateId: candidate.id,
      newStage: selectedStage,
      notes,
      rating,
      activeTab
    });
    onClose();
  };

  const getStageColor = (stage) => {
    const colors = {
      'Screening': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-blue-100 text-blue-800',
      'Technical Test': 'bg-purple-100 text-purple-800',
      'Final Interview': 'bg-indigo-100 text-indigo-800',
      'Offer': 'bg-orange-100 text-orange-800',
      'Hired': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>      
      {/* Sliding Panel */}
      <div className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Candidate Details</h2>
            <p className="text-sm text-gray-500 mt-1">{candidate.candidateId}</p>
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
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=22c55e&color=ffffff&size=128`;
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{candidate.name}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getStageColor(candidate.stage)}`}>
                {candidate.stage}
              </span>
              <p className="text-gray-600 font-medium">{candidate.position}</p>
            </div>

            {/* Contact & Stage Management */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-gray-700">{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-gray-700">{candidate.phone}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Move to Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select stage...</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
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
                  {/* Score Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Application Score</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        performance.color === 'green' ? 'bg-green-100 text-green-800' :
                        performance.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        performance.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {performance.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-900">{totalScore} / {multiplechoice.totalPossiblePoints}</p>
                      <p className="text-sm text-gray-600">{performance.message}</p>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900">Application Questions</h4>
                  {multiplechoice.questions.map((question) => {
                    const userAnswer = userAnswers.find(a => a.questionId === question.id);
                    const selectedOption = question.options.find(opt => opt.id === userAnswer?.selectedOptionId);
                    
                    return (
                      <div key={question.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-700">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-800">{question.question}</p>
                          <span className="text-sm font-semibold text-green-700 ml-2 whitespace-nowrap">
                            {selectedOption?.points}/{question.points} pts
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{selectedOption?.text}</p>
                        <p className="text-xs text-gray-500 italic">{selectedOption?.feedback}</p>
                      </div>
                    );
                  })}
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => console.log('Download CV')}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} className="text-green-700" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">CV</p>
                    <p className="text-xs text-gray-500">{candidate.cv}</p>
                  </div>
                </button>
                
                <button
                  onClick={() => console.log('Download Driver License')}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText size={16} className="text-green-700" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Driver License</p>
                    <p className="text-xs text-gray-500">license.pdf</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              Submit Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidatePanel;