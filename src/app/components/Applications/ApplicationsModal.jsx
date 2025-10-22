"use client";

import React, { useState, useEffect } from "react";
import { FileText, Mail, Phone, X, Star, Send } from "lucide-react";
import { fetchPersonalInfo } from "../../services/api";

const ApplicationModal = ({ application, onClose, onAction }) => {
  const isOpen = !!application;

  // State
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("application");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInterviewSchedule, setShowInterviewSchedule] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("");

  const emailTemplates = [
    { value: "reject", label: "Reject Application" },
    { value: "interview", label: "Schedule Interview" },
    { value: "shortlist", label: "Shortlist Candidate" },
    { value: "onboarding", label: "Onboarding Welcome" },
  ];

  const applicationQuestions = [
    {
      question: "Why are you interested in this position?",
      answer: application?.coverLetter || "See cover letter below.",
    },
    {
      question: "What are your salary expectations?",
      answer: application?.salary || "Not specified",
    },
    {
      question: "Years of experience?",
      answer: `${application?.experienceYears || 0} years`,
    },
    { question: "When can you start?", answer: "2 weeks notice period" },
  ];

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB");
  };

  // Fetch personal info
  useEffect(() => {
    if (!application?.applicant_id) {
      console.log("No applicant_id found yet:", application);
      return;
    }

    const loadPersonalInfo = async () => {
      setLoading(true);
      setError(null);
      console.log("Fetching personal info for:", application.applicant_id);

      try {
        const data = await fetchPersonalInfo(application.applicant_id);
        console.log("Fetched data:", data);
        setPersonalInfo(data);
      } catch (err) {
        console.error("Error fetching personal info:", err);
        setError("Failed to load personal info");
      } finally {
        setLoading(false);
      }
    };

    loadPersonalInfo();
  }, [application?.applicant_id]);

  useEffect(() => {
    if (application) {
      setActiveTab("application");
      setNotes("");
      setRating(0);
      setSelectedTemplate("");
    }
  }, [application?.id]);

  if (!application) return null;

  const handleDeleteApplication = () => {
    if (onAction) onAction(application.id, "delete");
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleScheduleInterview = () => {
    if (onAction)
      onAction(application.id, "schedule", {
        date: interviewDate,
        time: interviewTime,
        type: interviewType,
      });
    setShowInterviewSchedule(false);
    onClose();
  };

  const handleSubmit = () => {
    if (onAction)
      onAction(application.id, "update", {
        notes,
        rating,
      });
    onClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: "bg-gray-100 text-gray-800",
      Screening: "bg-yellow-100 text-yellow-800",
      Interview: "bg-blue-100 text-blue-800",
      Offer: "bg-purple-100 text-purple-800",
      Hired: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Application Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {application.applicationId}
              </p>
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
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      application.candidateName
                    )}&background=22c55e&color=ffffff&size=128`;
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {application.candidateName}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getStatusColor(
                  application.status
                )}`}
              >
                {application.status}
              </span>
              <p className="text-gray-600 font-medium">{application.position}</p>
            </div>

            {/* Contact & Personal Info */}
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

              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Personal Info</h2>

                {loading && <p className="text-gray-500">Loading personal info...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {personalInfo && (
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="text-gray-900 font-medium">
                        {personalInfo.first_name} {personalInfo.last_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="text-gray-900 font-medium">{personalInfo.phone_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">City:</span>
                      <p className="text-gray-900 font-medium">{personalInfo.city}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Province:</span>
                      <p className="text-gray-900 font-medium">{personalInfo.province}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Nationality:</span>
                      <p className="text-gray-900 font-medium">{personalInfo.nationality}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date of Birth:</span>
                      <p className="text-gray-900 font-medium">{formatDate(personalInfo.date_of_birth)}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Address:</span>
                      <p className="text-gray-900 font-medium">
                        {personalInfo.physical_address}, {personalInfo.postal_code}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex space-x-4 border-b border-gray-200 mb-4">
                {["application", "evaluation", "email", "documents"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === tab
                        ? "border-b-2 border-green-600 text-green-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div>
                {activeTab === "application" && (
                  <div className="space-y-3 text-sm">
                    {applicationQuestions.map((q, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 font-medium">{q.question}</p>
                        <p className="text-gray-900">{q.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "evaluation" && (
                  <div className="space-y-3 text-sm">
                    <label className="block text-gray-700 font-medium">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full border rounded-lg p-2"
                      rows={4}
                    />
                    <label className="block text-gray-700 font-medium mt-2">Rating</label>
                    <input
                      type="number"
                      value={rating}
                      min={0}
                      max={5}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                )}

                {activeTab === "email" && (
                  <div className="space-y-3 text-sm">
                    <label className="block text-gray-700 font-medium">Select Template</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="">Select a template</option>
                      {emailTemplates.map((template) => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => alert(`Email sent using ${selectedTemplate}`)}
                      className="mt-2 bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Send Email
                    </button>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-2 text-sm">
                    {application.documents?.length > 0 ? (
                      application.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-green-700 underline"
                        >
                          {doc.name}
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-500">No documents available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              Save Changes
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-100 text-red-700 py-3 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              Delete Application
            </button>

            <button
              onClick={() => setShowInterviewSchedule(true)}
              className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition-colors font-medium"
            >
              Schedule Interview
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-80 text-center">
            <p className="text-gray-800 font-medium">
              Are you sure you want to delete this application?
            </p>
            <div className="flex justify-between space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteApplication}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Schedule Modal */}
      {showInterviewSchedule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-80 text-center">
            <p className="text-gray-800 font-medium">Schedule Interview</p>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select Type</option>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
            </select>
            <div className="flex justify-between space-x-3">
              <button
                onClick={() => setShowInterviewSchedule(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationModal;