"use client"

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, FileText, Star, Send } from 'lucide-react';
import { useApplicationEvaluation } from '@/app/utils/useApplicationEvaluation';

const CandidatePanel = ({ candidate, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('application');
  const [selectedStage, setSelectedStage] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [readyToInterview, setReadyToInterview] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [showInterviewSchedule, setShowInterviewSchedule] = useState(false);

  const stages = [
    'Screening', 'Interview', 'Technical Test', 'Final Interview', 'Offer', 'Hired', 'Rejected'
  ];

  const emailTemplates = [
    { value: 'reject', label: 'Reject Application' },
    { value: 'interview', label: 'Schedule Interview' },
    { value: 'shortlist', label: 'Shortlist Candidate' },
    { value: 'onboarding', label: 'Onboarding Welcome' }
  ];

  const { applications, loading, error } = useApplicationEvaluation(candidate?.id);

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

  const handleEvaluation = async () => {
    const employeeId = sessionStorage.getItem("user_id");
    const candidateId = candidate?.id;
    const jobId = candidate?.job_id;

    if (!employeeId || !candidateId || !jobId) {
      setError("Missing required IDs for submission");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/candidateEvaluation/${employeeId}/${candidateId}/${jobId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: employeeId,
            candidate_id: candidateId,
            job_id: jobId,
            notes,
            rating,
          }),
        }
      );

      if (!response.ok) {
        const resText = await response.text();
        throw new Error(resText || "Failed to submit evaluation");
      }

      setNotes("");
      setRating(0);
      if (onSuccess) onSuccess();
      alert("Evaluation submitted successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = async () => {
  const employeeId = sessionStorage.getItem("user_id"); // current HR user
  const candidateId = candidate.id; // selected candidate
  const jobId = candidate.job_id; // job applied for
  const jobCode = candidate.job_code; // optional if needed

  // Add any extra info fields if you have them
  const payload = {
    employee_id: employeeId,
    candidate_id: candidateId,
    job_id: jobId,
    job_code: jobCode,
    date: interviewDate, // YYYY-MM-DD
    time: interviewTime, // HH:MM
    location: interviewLocation || "", // optional
    details: interviewDetails || "",   // optional
  };

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/interviewCandidate/${employeeId}/${candidateId}/${jobId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const resText = await response.text();
      throw new Error(resText || "Failed to schedule interview");
    }

    // Reset form
    setInterviewDate("");
    setInterviewTime("");
    setInterviewType("");
    setInterviewLocation("");
    setInterviewDetails("");

    setShowInterviewSchedule(false); // close modal
    alert("Interview scheduled successfully!");
    if (onSuccess) onSuccess(); // optional callback
  } catch (err) {
    console.error(err);
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
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

  const handleSetInterview = () => {
  if (!readyToInterview) return; // safety check
  setInterviewScheduled(true);

    // simulate interview completion after some action
    setTimeout(() => {
      setInterviewCompleted(true);
    }, 1000); // or replace with actual interview completion logic
  };

  const handleOnboardCandidate = () => {
    if (!interviewCompleted) return;
    setOnboarded(true);
    console.log("Candidate onboarded!");
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
              
              {/*<div>
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
              </div>*/}
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
                <>
                  {loading && <p>Loading application data...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {!loading && !error && applications.length === 0 && (
                    <p>No applications found for this candidate.</p>
                  )}

                  {!loading && !error && applications.map((application) => {
                    const systemScore = application.backendScore?.candidate_application_score || 0;
                    const mcScore = application.mcScore || 0;
                    const finalScore = systemScore;
                    const totalPossible = 10; // adjust based on your scoring
                    const performance = application.performance || { level: 'N/A', color: 'gray', message: '' };

                    return (
                      <div key={application.job_id} className="space-y-4">
                        {/* Score Summary */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">Application Score</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              performance.color === 'green' ? 'bg-green-100 text-green-800' :
                              performance.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                              performance.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>{performance.level}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-gray-900">{finalScore} / {totalPossible}</p>
                            <p className="text-sm text-gray-600">{performance.message}</p>
                          </div>
                        </div>

                        {/* Questions */}
                        {application.questions?.length > 0 && (
                          <>
                            <h4 className="font-medium text-gray-900">Application Questions</h4>
                            {application.questions.map((question, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-700">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="font-medium text-gray-800">{question.question}</p>
                                  <span className="text-sm font-semibold text-green-700 ml-2 whitespace-nowrap">
                                    {question.points_obtained || 0}/{question.total_points || 0} pts
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{question.response}</p>
                                {question.feedback && <p className="text-xs text-gray-500 italic">{question.feedback}</p>}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}
                </>
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

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleEvaluation}
                    className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
                  >
                    Submit Changes
                  </button>
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
            {/*<div className="space-y-3">
              <h4 className="font-medium text-gray-900">Documents</h4>
              <div className="grid grid-cols-2 gap-3">
                
                <button
                  onClick={() => {
                    if (candidate.cvUrl) {
                      const link = document.createElement("a");
                      link.href = candidate.cvUrl;
                      link.download = candidate.cv;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } else {
                      alert("CV not available");
                    }
                  }}
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
            </div>*/}

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            {/* Ready to Interview */}
            <button
              onClick={() => setReadyToInterview(true)}
              disabled={readyToInterview} // disable once clicked
              className={`w-full py-3 rounded-lg font-medium transition-colors
                ${readyToInterview ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}
            >
              Ready to Interview
            </button>

            {/* Set Interview */}
            <button
              onClick={() => setShowInterviewSchedulesetShowInterview(true)}
              disabled={!readyToInterview || interviewScheduled} // enable only after ready
              className={`w-full py-3 rounded-lg font-medium transition-colors
                ${!readyToInterview || interviewScheduled ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {interviewScheduled ? 'Interview Scheduled' : 'Set Interview'}
            </button>

            {/* Send Offer */}

            {/* Onboard Candidate */}
            <button
              onClick={handleOnboardCandidate}
              disabled={!interviewCompleted || onboarded} // enable only after interview
              className={`w-full py-3 rounded-lg font-medium transition-colors
                ${!interviewCompleted || onboarded ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
            >
              {onboarded ? 'Candidate Onboarded' : 'Onboard Candidate'}
            </button>
          </div>
        </div>
      </div>

    {/* Interview Schedule Modal */}
    {showInterviewSchedule && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-6 relative">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold text-gray-800">Schedule Interview</h2>
            <button
              onClick={() => setShowInterviewSchedule(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          {/* Time */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Interview Type</label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            >
              <option value="">Select Type</option>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={interviewLocation}
              onChange={(e) => setInterviewLocation(e.target.value)}
              placeholder="e.g., Zoom link or Office address"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          {/* Details / Notes */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Details / Notes</label>
            <textarea
              value={interviewDetails}
              onChange={(e) => setInterviewDetails(e.target.value)}
              rows={3}
              placeholder="Add any extra info for the candidate..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-between space-x-3 mt-4">
            <button
              onClick={() => setShowInterviewSchedule(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleInterview}
              className={`flex-1 py-3 rounded-lg transition-colors font-medium ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </div>
      </div>
    )}

    </>
  );
};


export default CandidatePanel;
