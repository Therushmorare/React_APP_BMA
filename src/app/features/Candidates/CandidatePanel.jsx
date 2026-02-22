"use client";

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, FileText, Star, Send } from 'lucide-react';
import { useApplicationEvaluation } from '@/app/utils/useApplicationEvaluation';

const CandidateDetailsPanel = ({ candidate, isOpen, onClose, onSuccess }) => {
  // ====== Employee ID ======
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    // Only runs on client
    const id = sessionStorage.getItem("user_id");
    if (id) setEmployeeId(id);
  }, []);

  // ====== Panel State ======
  const [activeTab, setActiveTab] = useState('application');
  const [selectedStage, setSelectedStage] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [readyToInterview, setReadyToInterview] = useState(false);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [showInterviewSchedule, setShowInterviewSchedule] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [offerDetails, setOfferDetails] = useState("");
  const [offerSalary, setOfferSalary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [onboardingNotes, setOnboardingNotes] = useState("");
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showConfirmInterviewModal, setShowConfirmInterviewModal] = useState(false);

  // NEW STATES
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewDetails, setInterviewDetails] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);

  // ====== Stages & Email Templates ======
  const stages = [
    'Screening', 'Interview', 'Technical Test', 'Final Interview', 'Offer', 'Hired', 'Rejected'
  ];

  const emailTemplates = [
    { value: 'reject', label: 'Reject Application' },
    { value: 'interview', label: 'Schedule Interview' },
    { value: 'shortlist', label: 'Shortlist Candidate' },
    { value: 'onboarding', label: 'Onboarding Welcome' }
  ];

  // ====== Fetch candidate applications ======
  const { applications, loading: evalLoading, error: evalError } = useApplicationEvaluation(candidate?.id);

  // ====== Reset state when candidate opens ======
  useEffect(() => {
    if (isOpen && candidate) {
      setSelectedStage(candidate.stage || '');
      setActiveTab('application');
      setNotes('');
      setRating(0);
      setSelectedTemplate('');
      setReadyToInterview(false);
      setInterviewScheduled(false);
      setInterviewCompleted(false);
      setOfferSent(false);
      setOnboarded(false);
      setShowInterviewSchedule(false);
      setShowOfferModal(false);
      setShowOnboardModal(false);
      setOfferDetails("");
      setOfferSalary("");
      setStartDate("");
      setOnboardingNotes("");
      setSelectedOffer(null);
      setInterviewDate("");
      setInterviewTime("");
      setInterviewType("");
      setInterviewLocation("");
      setInterviewDetails("");
      setError("");
    }
  }, [isOpen, candidate?.id]);

  if (!candidate) return null;

  // ====== Helper Functions ======
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

  // ====== Submit Evaluation ======
  const handleEvaluation = async () => {
    console.log("handleEvaluation triggered");
    const token = sessionStorage.getItem('access_token'); // get JWT token

    if (!token) {
      console.error("JWT token not found in sessionStorage. User might need to log in again.");
      setError("You are not authenticated. Please log in again.");
      return;
    }

    if (!employeeId || !candidate?.id || !candidate?.jobCode) {
      setError("Missing required IDs for submission");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/candidateEvaluation/${employeeId}/${candidate.id}/${candidate.job_id}`,
        {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
          body: JSON.stringify({ employee_id: employeeId, candidate_id: candidate.id, job_id: candidate.jobCode, notes, rating }),
        }
      );

      if (!response.ok) throw new Error(await response.text() || "Failed to submit evaluation");

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

  // ====== Schedule Interview ======
  const handleScheduleInterview = async () => {
    const token = sessionStorage.getItem('access_token'); // get JWT token

    if (!token) {
      console.error("JWT token not found in sessionStorage. User might need to log in again.");
      setError("You are not authenticated. Please log in again.");
      return;
    }

    if (!employeeId) {
      setError("Missing employee ID");
      return;
    }

    if (!interviewDate || !interviewTime) {
      alert("Please select date and time for the interview");
      return;
    }

    const payload = {
      employee_id: employeeId,
      candidate_id: candidate.id,
      job_id: candidate.jobCode,
      job_code: candidate.jobCode,
      date: interviewDate,
      time: interviewTime,
      location: interviewLocation || "",
      details: interviewDetails || ""
    };

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/interviewCandidate/${employeeId}/${candidate.id}/${candidate.job_id}`,
        { method: "POST",
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
          body: JSON.stringify(payload) }
      );

      if (!response.ok) throw new Error(await response.text() || "Failed to schedule interview");

      setInterviewDate(""); setInterviewTime(""); setInterviewType("");
      setInterviewLocation(""); setInterviewDetails("");
      setShowInterviewSchedule(false);
      setInterviewScheduled(true);
      alert("Interview scheduled successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ====== Send Offer ======
  const handleSendOfferConfirm = async () => {
    const token = sessionStorage.getItem('access_token'); // get JWT token

    if (!employeeId) {
      setError("Missing employee ID");
      return;
    }

    if (!token) {
      console.error("JWT token not found in sessionStorage. User might need to log in again.");
      setError("You are not authenticated. Please log in again.");
      return;
    }

    if (!employeeId) {
      setError("Missing employee ID");
      return;
    }

    if (!offerDetails) {
      alert("Please add the offer details before sending.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/sendOffer/${employeeId}/${candidate.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ 
             employee_id: employeeId,
             candidate_id: candidate.id,
             job_id: candidate.jobCode, 
             message: offerDetails 
            }),
        }
      );

      if (!response.ok) throw new Error(await response.text() || "Failed to send offer");

      setOfferDetails("");
      setShowOfferModal(false);
      setOfferSent(true);
      alert("Offer sent successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while sending the offer");
    } finally {
      setLoading(false);
    }
  };

  // ====== Fetch Candidate Offers ======
  useEffect(() => {
    const fetchCandidateOffers = async () => {
      if (!candidate?.id) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/myJobOffers/${candidate.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch job offers");
        }

        const data = await response.json();

        console.log("Fetched offers:", data); // Debugging

        setOffers(data || []); // <-- FIXED
        setSelectedOffer(null); // Reset selection when candidate changes

      } catch (err) {
        console.error("Error fetching offers:", err);
        setError(err.message || "Something went wrong fetching offers");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateOffers();
  }, [candidate?.id]);

  // ====== Onboard Candidate ======
  const handleOnboardConfirm = async () => {
    console.log("🔥 Onboard button clicked");

    const token = sessionStorage.getItem("access_token");

    if (!employeeId) {
      setError("Missing employee ID");
      return;
    }

    if (!candidate?.id) {
      setError("Candidate ID missing");
      return;
    }

    if (!selectedOffer) {
      setError("Please select an offer before onboarding.");
      return;
    }

    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/onboardEmployee/${employeeId}/${candidate.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id: employeeId,
            candidate_id: candidate.id,
            job_id: selectedOffer.job_id,
            offer_id: selectedOffer.offer_id,
            company_domain: selectedOffer.office || "",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to onboard candidate");
      }

      // Success state updates
      setShowOnboardModal(false);
      setOnboarded(true);
      alert("Candidate onboarded successfully!");

    } catch (err) {
      console.error("Onboarding error:", err);
      setError(err.message || "Something went wrong during onboarding");
    } finally {
      setLoading(false);
    }
  };

  const handleReadyToInterview = async () => {
  const token = sessionStorage.getItem('access_token'); // get JWT token

  if (!employeeId) {
    setError("Missing employee ID");
    return;
  }

  if (!candidate?.id) {
    setError("Candidate ID missing");
    return;
  }

  if (!token) {
    console.error("JWT token not found in sessionStorage. User might need to log in again.");
    setError("You are not authenticated. Please log in again.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/updateApplicationStatus/${employeeId}/${candidate.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: employeeId,
          candidate_id: candidate.id,
          status: "READY_TO_INTERVIEW",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update application status: ${errorText}`);
    }

    const data = await response.json();
    console.log("Application updated successfully:", data);
    setReadyToInterview(true); // update UI state
    setShowConfirmInterviewModal(false); // close confirm modal
    alert("Candidate marked as Ready to Interview!");
    
  } catch (err) {
    console.error("Error updating application:", err);
    setError("Failed to update application. Check console for details.");
  } finally {
    setLoading(false);
  }
  };

  const handleSendEmail = async () => {
    setError("");
    setSuccess("");

    if (!message.trim()) {
      setError("Please type a message before sending.");
      return;
    }

    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/sendCandidateMessage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            candidate_id: candidate.id,
            employee_id: employeeId,
            message: message,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to send email");
      }

      setSuccess("Email sent successfully!");
      setMessage(""); // clear message after sending
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ====== Simulate Interview Completion ======
  const handleSetInterview = () => {
    if (!readyToInterview) return;
    setInterviewScheduled(true);

    setTimeout(() => {
      setInterviewCompleted(true);
    }, 1000);
  };

  const handleOnboardCandidate = () => {
    if (!interviewCompleted) return;
    setOnboarded(true);
    console.log("Candidate onboarded!");
  };

  // ====== Panel Submit ======
  const handleSubmit = () => {
    console.log('Submitting changes:', { candidateId: candidate.id, newStage: selectedStage, notes, rating, activeTab });
    onClose();
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
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleEvaluation(); }}
                    disabled={!employeeId || !candidate?.id || !candidate?.jobCode || loading}
                    className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Changes"}
                  </button>
                </div>
              </div>
              )}

              {/* Email Tab */}
              {activeTab === 'email' && (
                <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        placeholder="Type your message here..."
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={loading || !message.trim()}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
                      >
                        <Send size={16} />
                        <span>{loading ? "Sending..." : "Send"}</span>
                      </button>
                    </div>

                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3 justify-between">
          {/* Ready to Interview */}
          <button
            onClick={() => setShowConfirmInterviewModal(true)}
            disabled={readyToInterview}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200
              ${readyToInterview 
                ? 'bg-gray-400 cursor-not-allowed opacity-80' 
                : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
          >
            <span className="text-xl">✅</span>
            <span>{readyToInterview ? 'Ready' : 'Mark Ready'}</span>
          </button>

          {/* Set Interview */}
          <button
            onClick={() => setShowInterviewSchedule(true)}
            disabled={interviewScheduled}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200
              ${interviewScheduled
                ? 'bg-gray-400 cursor-not-allowed opacity-80'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
          >
            <span className="text-xl">📅</span>
            <span>{interviewScheduled ? 'Scheduled' : 'Set Interview'}</span>
          </button>

          {/* Send Offer */}
          <button
            onClick={() => setShowOfferModal(true)}
            disabled={offerSent}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200
              ${offerSent
                ? 'bg-gray-400 cursor-not-allowed opacity-80'
                : 'bg-yellow-500 hover:bg-yellow-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
          >
            <span className="text-xl">💼</span>
            <span>{offerSent ? 'Sent' : 'Send Offer'}</span>
          </button>

          {/* Onboard Candidate */}
          <button
            onClick={() => setShowOnboardModal(true)}
            disabled={onboarded}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200
              ${onboarded
                ? 'bg-gray-400 cursor-not-allowed opacity-80'
                : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
          >
            <span className="text-xl">🎉</span>
            <span>{onboarded ? 'Onboarded' : 'Onboard'}</span>
          </button>
        </div>

        </div>
      </div>

    {showConfirmInterviewModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50 p-4">
        <div className="bg-white rounded-lg p-6 space-y-6 w-full max-w-sm text-center shadow-lg animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800">Confirm Action</h2>
          <p className="text-gray-600">Are you sure you want to mark this candidate as ready for interview?</p>
          <div className="flex justify-between gap-3">
            <button
              className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              onClick={() => setShowConfirmInterviewModal(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              onClick={() => {
                handleReadyToInterview();
                setShowConfirmInterviewModal(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Interview Schedule Modal */}
    {showInterviewSchedule && (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50 px-4">
        <div className="bg-white rounded-lg p-6 space-y-6 w-full max-w-sm text-center shadow-lg animate-fade-in">
          
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
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setShowInterviewSchedule(false)}
              className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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

      {/* Send Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50 px-4">
          <div className="bg-white rounded-lg p-6 space-y-6 w-full max-w-sm text-center shadow-lg animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-800">Send Offer</h2>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Offer Details */}
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-medium text-gray-700">Offer Details</label>
              <textarea
                value={offerDetails}
                onChange={(e) => setOfferDetails(e.target.value)}
                rows={4}
                placeholder="Add offer details here..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-600"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between space-x-3 mt-4">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOfferConfirm}
                className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Candidate Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 space-y-6 w-full max-w-sm text-center shadow-lg animate-fade-in">

            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Onboard Candidate
              </h2>
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600">
              Select the offer you want to finalize for this candidate.
            </p>

            {/* Offer Selection */}
            {offers.length > 0 ? (
              <select
                value={selectedOffer?.offer_id || ""}
                onChange={(e) => {
                  const offer = offers.find((o) => o.offer_id === e.target.value);
                  setSelectedOffer(offer || null);
                }}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Select an offer</option>
                {offers.map((offer) => (
                  <option key={offer.offer_id} value={offer.offer_id}>
                    {`Offer ID: ${offer.offer_id.substring(0, 8)} — ${offer.status}`}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-red-500">
                No offers available for this candidate.
              </p>
            )}

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-between space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleOnboardConfirm}
                disabled={loading || offers.length === 0}
                className={`flex-1 py-3 rounded-lg font-medium text-white transition-colors
                  ${
                    loading || offers.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }
                `}
              >
                {loading ? "Processing..." : "Onboard"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};


export default CandidateDetailsPanel;
