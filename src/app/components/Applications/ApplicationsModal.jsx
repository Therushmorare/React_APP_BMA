"use client";

import React, { useState, useEffect } from "react";
import { FileText, Mail, Phone, X, Star, Send, Loader, ChevronUp, ChevronDown} from "lucide-react";
import { fetchPersonalInfo } from "../../services/api";
import { fetchQuestions } from "../../services/api";
import { fetchApplicationScore } from "../../services/api";
import { fetchEducation } from "../../services/api";
import { fetchExperience } from "../../services/api";
import { fetchSkills } from "../../services/api";
import ApplicationScoreCard from "./ApplicationScoreCard";
import ApplicationEvaluationCard from "./ApplicationEvaluationCard";

const ApplicationModal = ({ application, onClose, onAction }) => {
  const isOpen = !!application;

  // State
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applicationQuestions, setApplicationQuestions] = useState([])
  const [activeTab, setActiveTab] = useState("application");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInterviewSchedule, setShowInterviewSchedule] = useState(false);
  const [showScreeningConfirm, setShowScreeningConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [interviewType, setInterviewType] = useState("");
  const [score, setScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [scoreError, setScoreError] = useState("");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [eduOpen, setEduOpen] = useState(true);
  const [expOpen, setExpOpen] = useState(true);

  const emailTemplates = [
    { value: "reject", label: "Reject Application" },
    { value: "interview", label: "Schedule Interview" },
    { value: "shortlist", label: "Shortlist Candidate" },
    { value: "onboarding", label: "Onboarding Welcome" },
  ];

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB");
  };
  
  // Fetch personal info
  useEffect(() => {
    if (!application?.id) return;

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [personal, edu, exp, sk] = await Promise.all([
          fetchPersonalInfo(application.id),
          fetchEducation(application.id),
          fetchExperience(application.id),
          fetchSkills(application.id),
        ]);

        setPersonalInfo(personal);
        setEducation(edu);
        setExperience(exp);
        setSkills(sk.skills || []);
      } catch (err) {
        console.error("Error loading applicant data:", err);
        setError("Failed to load applicant data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [application]);

  // Fetch application questions and answers
  useEffect(() => {
    const applicantId = application?.id;
    const jobId = application?.job_id;

    if (!applicantId || !jobId) {
      console.warn("Missing applicantId or jobId:", { applicantId, jobId });
      return;
    }

    const loadQuestions = async () => {
      setLoadingQuestions(true);
      console.log(`Fetching questions for Job ${jobId}, Applicant ${applicantId}`);

      try {
        const data = await fetchQuestions(jobId, applicantId);
        console.log("Fetched application questions:", data);
        setApplicationQuestions(data || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setApplicationQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [application?.id, application?.job_id]);

  // Fetch Score Data
  useEffect(() => {
    if (activeTab === "score" && application?.id && application?.applicationId) {
      const loadScore = async () => {
        setLoadingScore(true);
        setScoreError("");
        try {
          const data = await fetchApplicationScore(application.job_id, application.id);
          setScore(data);
        } catch (err) {
          console.error("Error fetching score:", err);
          setScoreError("Failed to load score");
        } finally {
          setLoadingScore(false);
        }
      };
      loadScore();
    }
  }, [activeTab, application]);

  useEffect(() => {
    if (!application?.id) return;

    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          "https://jellyfish-app-z83s2.ondigitalocean.app/api/admin/allDocuments",
          {
            method: "GET",
            headers: { Accept: "application/json" }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();

        //Filter documents for this applicant only
        const applicantDocuments = data
          .filter(doc => doc.applicant_id === application.id)
          .map(doc => ({
            name: doc.type || "Qualification Document",
            url: doc.document
          }));

        setDocuments(applicantDocuments);

      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments([]);
      }
    };

    fetchDocuments();
  }, [application?.id]);

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

  const handleScreenApplicant = async () => {
    if (!application?.id) {
      console.warn("No application selected.");
      return;
    }

    const employeeId = sessionStorage.getItem('user_id');
    const candidateId = application.id;

    if (!employeeId) {
      console.error("Employee ID not found in sessionStorage.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/updateApplicationStatus/${employeeId}/${candidateId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: employeeId,
            candidate_id: candidateId,
            status: "SCREENED", // change this dynamically if needed
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update application status: ${errorText}`);
      }

      const data = await response.json();
      console.log("Application updated successfully:", data);

    } catch (error) {
      console.error("Error updating application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectApplication = async () => {
    if (!application?.id) {
      console.warn("No application selected.");
      return;
    }

    const employeeId = sessionStorage.getItem('user_id');
    const candidateId = application.id;

    if (!employeeId) {
      console.error("Employee ID not found in sessionStorage.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/updateApplicationStatus/${employeeId}/${candidateId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employee_id: employeeId,
            candidate_id: candidateId,
            status: "REJECTED", // change this dynamically if needed
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update application status: ${errorText}`);
      }

      const data = await response.json();
      console.log("Application updated successfully:", data);

    } catch (error) {
      console.error("Error updating application:", error);
    } finally {
      setLoading(false);
    }
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

              {/* Skills as badges */}
              <div className="col-span-2">
                <span className="text-gray-600">Skills:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills listed</span>
                  )}
                </div>
              </div>

              {/* Education collapsible */}
              <div className="col-span-2">
                <button
                  onClick={() => setEduOpen(!eduOpen)}
                  className="flex items-center justify-between w-full bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Education {eduOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {eduOpen && (
                  <ul className="mt-2 list-disc list-inside text-gray-900 text-sm">
                    {education.length > 0 ? (
                      education.map((edu) => (
                        <li key={edu.qualification_id}>
                          {edu.qualification} - {edu.institution} ({edu.year_completed})
                        </li>
                      ))
                    ) : (
                      <li>No education listed</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Experience collapsible */}
              <div className="col-span-2">
                <button
                  onClick={() => setExpOpen(!expOpen)}
                  className="flex items-center justify-between w-full bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Experience {expOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expOpen && (
                  <ul className="mt-2 list-disc list-inside text-gray-900 text-sm">
                    {experience.length > 0 ? (
                      experience.map((exp) => (
                        <li key={exp.experience_id}>
                          {exp.title} at {exp.organization} ({formatDate(exp.start_date)} - {formatDate(exp.end_date)})
                          {exp.description && `: ${exp.description}`}
                        </li>
                      ))
                    ) : (
                      <li>No experience listed</li>
                    )}
                  </ul>
                )}
              </div>

            </div>

            {/* Tabs */}
            <div>
              <div className="flex space-x-4 border-b border-gray-200 mb-4">
                {["application", "score", "documents"].map((tab) => (
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
                    <h2 className="text-xl font-bold mb-4">Application Questions</h2>
                    {loadingQuestions ? (
                      <p>Loading questions...</p>
                    ) : applicationQuestions.length === 0 ? (
                      <p className="text-gray-500">
                        No questions found for this applicant.
                      </p>
                    ) : (
                      applicationQuestions.map((q, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-600 font-medium">{q.question}</p>
                          <p className="text-gray-900">{q.response}</p>
                        </div>
                      ))
                    )}
                  </div>

                )}

                {activeTab === "score" && (
                  <div className="space-y-3 text-sm">
                    {loadingScore ? (
                      <div className="flex justify-center items-center">
                        <Loader className="animate-spin text-green-700" size={24} />
                      </div>
                    ) : score ? (
                      <>
                        <ApplicationScoreCard label="Experience Score" value={score.experience_score} />
                        <ApplicationScoreCard label="Location Score" value={score.location_score} />
                        <ApplicationScoreCard label="Qualification Score" value={score.qualification_score} />
                        <ApplicationScoreCard label="Salary Score" value={score.salary_score} />
                        <ApplicationScoreCard label="Candidate Application Score" value={score.candidate_application_score} max={10} />
                      </>
                    ) : (
                      <p className="text-gray-500">{scoreError || "No score available for this applicant."}</p>
                    )}
                  </div>
                )}

                {activeTab === "evaluation" && (
                    <ApplicationEvaluationCard
                      employeeId="YOUR_EMPLOYEE_ID" // get from session storage
                      candidateId={application.id}
                      jobId={application.job_id}
                    />
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
                    {documents.length > 0 ? (
                      documents.map((doc, idx) => (
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
            <div className="grid grid-cols-2 gap-3">
              {/* Screen Applicant */}
              <button
                onClick={() => setShowScreeningConfirm(true)} // fixed typo
                className="w-full flex items-center justify-center gap-2 bg-white text-green-700 border border-green-700 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                <Star size={16} /> {/* optional icon for clarity */}
                Screen Applicant
              </button>

              {/* Reject Applicant */}
              <button
                onClick={() => setShowRejectConfirm(true)}
                className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-300 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <X size={16} /> {/* optional icon for clarity */}
                Reject Applicant
              </button>
            </div>
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

      {/* Rejection Confirmation Modal */}
      {showRejectConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-80 text-center">
            <p className="text-gray-800 font-medium">
              Are you sure you want to reject this application?
            </p>
            <div className="flex justify-between space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectApplication}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screening Confirmation */}
      {showScreeningConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 space-y-6 w-full max-w-sm text-center shadow-lg animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Screening
            </h2>
            <p className="text-gray-600">
              Are you sure you want to mark this applicant for screening? This action cannot be undone.
            </p>
            <div className="flex justify-between gap-3">
              <button
                onClick={() => setShowScreeningConfirm(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleScreenApplicant}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Confirm
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