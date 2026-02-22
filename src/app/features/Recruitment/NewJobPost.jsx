"use client";

import React, { useMemo, useState } from "react";
import { Save, Eye, Plus, X, GripVertical, Loader2, CheckCircle } from "lucide-react";

const NewJobPost = ({ onClose, onSave, existingJob = null }) => {
  const [activeTab, setActiveTab] = useState("requirements");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

// ------------------ helpers: auth + json fetch ------------------
const getAuth = () => {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
  const employeeId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("employee_id") || sessionStorage.getItem("user_id")
      : null;
  if (!token || !employeeId) throw new Error("Missing access_token or employee_id in sessionStorage");
  return { token, employeeId };
};

const postJSON = async (url, token, body) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  let data = null;
  const text = await res.text().catch(() => "");
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error || data.detail)) || `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data || {};
};

const splitToList = (text) =>
  (text || "")
    .split(/\r?\n|•|-/g)
    .map((s) => s.replace(/^[\s•-]+/, "").trim())
    .filter(Boolean);

// ------------------ API submit flow ------------------
const handleSubmit = async (publishNow = false) => {
  setIsSubmitting(true);
  try {
    const { token, employeeId } = getAuth();

    // Build expected_candidate per API
    const expectedTitle = formData.seniorityLevel
      ? `${formData.seniorityLevel} ${formData.title}`.trim()
      : formData.title || "Candidate";
    const expected_candidate = `[${formData.expectedCandidateType === "internal" ? "Internal" : "External"}] ${expectedTitle}`;

    // Job duties
    const duties_list = splitToList(formData.responsibilities || "");

    // JobPost payload
    const jobPostPayload = {
      employee_id: employeeId,
      job_id: existingJob?.id || String(Date.now()), // ensure job_id exists
      expected_candidate,
      job_title: formData.title || "",
      candidate_type: formData.expectedCandidateType || "External",
      employment_type: formData.type || "",
      department: formData.department || "",
      office:
        formData.locationType === "onsite"
          ? [formData.city, "Onsite"].filter(Boolean).join(", ")
          : formData.locationType.charAt(0).toUpperCase() + formData.locationType.slice(1),
      required_applicants_num: 1,
      closing_date: formData.applicationDeadline || "",
      description: formData.description || "",
      requirements_list: (formData.requiredSkills || []).map(String),
      duties_list,
      documents_required_list: (formData.documentsRequired || []).map(String),
    };

    const jobPostRes = await postJSON(
      `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/jobPost/${encodeURIComponent(employeeId)}`,
      token,
      jobPostPayload
    );

    const jobId = jobPostRes?.job_id || jobPostRes?.id || jobPostRes?.data?.id || jobPostPayload.job_id;

    // JobFilters payload (send only if any filter is provided)
    const hasAnyFilter =
      (formData.experience && `${formData.experience}`.length > 0) ||
      (formData.preferredLocation && formData.preferredLocation.length > 0) ||
      (formData.qualification && formData.qualification.length > 0) ||
      (formData.offeringSalary && `${formData.offeringSalary}`.length > 0);

    if (hasAnyFilter) {
      const jobFiltersPayload = {
        employee_id: employeeId,
        job_id: jobId,
        required_experience_years: Number(formData.experience || 0),
        preferred_candidate_location: formData.preferredLocation || "",
        preferred_qualification: formData.qualification || "",
        offered_salary: Number(formData.offeringSalary || 0),
      };

      await postJSON(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/jobFilters/${encodeURIComponent(employeeId)}/${encodeURIComponent(
          jobId
        )}`,
        token,
        jobFiltersPayload
      );
    }

    // JobQuestion payloads
    if (Array.isArray(formData.customQuestions) && formData.customQuestions.length > 0) {
      await Promise.all(
        formData.customQuestions.map((q) =>
          postJSON(
            `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/jobQuestion/${encodeURIComponent(
              employeeId
            )}/${encodeURIComponent(jobId)}`,
            token,
            {
              employee_id: employeeId,
              job_id: jobId,
              question_type: q.type || "short-text",
              category: "General",
              mandatory_status: q.required ? "Yes" : "No",
              question: q.question || "",
            }
          )
        )
      );
    }

    // Local callback
    const localJob = {
      id: jobId,
      ...formData,
      status: publishNow ? "Paused" : "Draft",
      applicants: existingJob ? existingJob.applicants : 0,
      createdAt: existingJob ? existingJob.createdAt : new Date().toISOString().split("T")[0],
    };
    onSave && onSave(localJob);

    if (publishNow) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    } else {
      onClose();
    }
  } catch (err) {
    console.error(err);
    alert(`Could not submit job. ${err?.message || "Please try again."}`);
  } finally {
    setIsSubmitting(false);
  }
};

  // Gate publish button without changing visuals
  const canPublish = useMemo(() => {
    const hasAuth =
      typeof window === "undefined"
        ? false
        : !!sessionStorage.getItem("access_token") &&
          !!(sessionStorage.getItem("employee_id") || sessionStorage.getItem("user_id"));
    return (
      hasAuth &&
      formData.title.trim() &&
      formData.department.trim() &&
      formData.type.trim() &&
      formData.seniorityLevel.trim() &&
      formData.description.trim()
    );
  }, [formData]);

  const departmentOptions = [
    "Engineering",
    "Product",
    "Design",
    "Analytics",
    "Marketing",
    "Sales",
    "HR",
    "Operations",
    "Finance",
    "Legal",
  ];
  const seniorityOptions = ["Entry Level", "Mid Level", "Senior Level", "Executive Level"];
  const questionTypes = [
    { value: "short-text", label: "Short Text" },
    { value: "long-text", label: "Long Text" },
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "yes-no", label: "Yes/No" },
    { value: "file-upload", label: "File Upload" },
  ];

  // ------------------ Preview ------------------
  if (isPreview) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Job Post Preview</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsPreview(false)}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={!canPublish || isSubmitting}
              title={!canPublish ? "Fill required fields and ensure session has access_token + employee_id" : undefined}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={14} className="mr-1" />
                  Publish Job
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || "Job Title"}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <span>
                  <span className="font-medium">Department:</span> {formData.department}
                </span>
                <span>
                  <span className="font-medium">Type:</span> {formData.type}
                </span>
                <span>
                  <span className="font-medium">Level:</span> {formData.seniorityLevel}
                </span>
                <span>
                  <span className="font-medium">Location:</span>{" "}
                  {formData.locationType === "onsite"
                    ? [formData.city, "Onsite"].filter(Boolean).join(", ")
                    : formData.locationType.charAt(0).toUpperCase() + formData.locationType.slice(1)}
                </span>
                {formData.salaryRange.min && (
                  <span>
                    <span className="font-medium">Salary:</span> {formData.salaryRange.currency}{" "}
                    {formData.salaryRange.min} - {formData.salaryRange.max}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {formData.description && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{formData.description}</p>
                </section>
              )}

              {formData.responsibilities && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Key Responsibilities</h2>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {formData.responsibilities}
                  </div>
                </section>
              )}

              {formData.requiredSkills.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills.map((skill, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {formData.preferredSkills.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Preferred Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredSkills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {formData.education && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Education & Experience</h2>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">{formData.education}</div>
                </section>
              )}

              {formData.benefits && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Benefits & Perks</h2>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">{formData.benefits}</div>
                </section>
              )}

              {formData.customQuestions.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Application Questions</h2>
                  <div className="space-y-4">
                    {formData.customQuestions.map((question) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-900">{question.question}</p>
                          {question.required && <span className="text-red-500 text-sm">*</span>}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Type: {questionTypes.find((t) => t.value === question.type)?.label}
                        </p>
                        {question.type === "multiple-choice" && question.options.length > 0 && (
                          <div className="space-y-1">
                            {question.options.map((option, i) => (
                              <div key={i} className="flex items-center">
                                <input type="radio" disabled className="mr-2" />
                                <span className="text-sm text-gray-600">{option}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ Main UI (layout preserved) ------------------
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Success Alert - Fixed Position */}
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-green-50 border-b border-green-200 flex items-center">
          <CheckCircle size={20} className="text-green-600 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-green-800">Job Post Submitted Successfully!</h4>
            <p className="text-sm text-green-700 mt-1">
              Your job posting has been submitted for approval and will be reviewed shortly.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`border-b border-gray-200 p-4 ${showSuccess ? "mt-16" : ""}`}>
        {/* Tab Navigation */}
        <div className="mt-4 flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("jobFilters")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "jobFilters" ? "bg-white text-green-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Job Filters
          </button>
          <button
            onClick={() => setActiveTab("requirements")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "requirements" ? "bg-white text-green-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Job Requirements
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "questions" ? "bg-white text-green-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Application Questions
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "jobFilters" && (
          <div className="space-y-6">
            {/* Job Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  placeholder="e.g 5 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Candidate Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  placeholder="e.g Midrand"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Qualification <span className="text-red-500">*</span>
                </label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                >
                  <option value="">Select qualification</option>
                  <option value="HighSchool Diploma">HighSchool Diploma</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Degree">Degree</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offering Salary <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="offeringSalary"
                  value={formData.offeringSalary}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  placeholder="e.g R50 000"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  >
                    <option value="">Select Department</option>
                    {["Engineering","Product","Design","Analytics","Marketing","Sales","HR","Operations","Finance","Legal"].map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seniority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="seniorityLevel"
                    value={formData.seniorityLevel}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  >
                    {["","Entry Level","Mid Level","Senior Level","Executive Level"].map((level) => (
                      <option key={level} value={level}>{level || "Select Level"}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Candidate Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {["internal", "external"].map((ct) => (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => handleChange({ target: { name: "expectedCandidateType", value: ct } })}
                      className={`py-2 px-3 text-sm font-medium border rounded-lg transition-colors ${
                        formData.expectedCandidateType === ct
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {ct.charAt(0).toUpperCase() + ct.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Encoded into <code>expected_candidate</code> for the API.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type <span className="text-red-500">*</span></label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100">
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {["onsite", "hybrid", "remote"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange({ target: { name: "locationType", value: type } })}
                      className={`py-2 px-3 text-sm font-medium border rounded-lg transition-colors ${
                        formData.locationType === type
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                {formData.locationType === "onsite" && (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                    placeholder="Enter city name"
                  />
                )}
              </div>

              {/* Salary Range (UI only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range (Optional)</label>
                <div className="grid grid-cols-3 gap-2">
                  <select name="salaryRange.currency" value={formData.salaryRange.currency} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100">
                    <option value="ZAR">ZAR</option><option value="USD">USD</option><option value="EUR">EUR</option>
                  </select>
                  <input type="number" name="salaryRange.min" value={formData.salaryRange.min} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100" placeholder="Min" />
                  <input type="number" name="salaryRange.max" value={formData.salaryRange.max} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100" placeholder="Max" />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posting Date</label>
                  <input type="date" name="postingDate" value={formData.postingDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100" />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  placeholder="Provide a comprehensive overview of the role and what the candidate will be doing..."
                />
              </div>

              {/* Key Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Responsibilities</label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  placeholder="• Lead software development projects&#10;• Collaborate with cross-functional teams&#10;• Mentor junior developers"
                />
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                    placeholder="Add a required skill"
                    onKeyPress={(e) => e.key === "Enter" && addSkill("required")}
                  />
                  <button type="button" onClick={() => addSkill("required")} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills.map((skill, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                      {skill}
                      <button type="button" onClick={() => removeSkill(index, "required")} className="ml-2 text-red-600 hover:text-red-800">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newPreferredSkill}
                    onChange={(e) => setNewPreferredSkill(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                    placeholder="Add a preferred skill"
                    onKeyPress={(e) => e.key === "Enter" && addSkill("preferred")}
                  />
                  <button type="button" onClick={() => addSkill("preferred")} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.preferredSkills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                      {skill}
                      <button type="button" onClick={() => removeSkill(index, "preferred")} className="ml-2 text-blue-600 hover:text-blue-800">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Education & Benefits (UI only right now) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education & Experience Requirements</label>
                <textarea name="education" value={formData.education} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100" placeholder="• Bachelor's degree in ...&#10;• 5+ years of ..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits & Perks</label>
                <textarea name="benefits" value={formData.benefits} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100" placeholder="• Medical aid ...&#10;• Flexible hours ..." />
              </div>

              {/* Required Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Documents
                </label>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDocument())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                    placeholder='e.g. "ID Copy", "CV", "Qualifications", "Portfolio PDF"'
                  />
                  <button
                    type="button"
                    onClick={addDocument}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    aria-label="Add required document"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {["ID Copy", "CV/Resume", "Cover Letter", "Qualifications", "References", "Portfolio PDF"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setNewDocument(s);
                        addDocument();
                      }}
                      className="text-xs px-2 py-1 border border-gray-300 rounded-full hover:bg-gray-50"
                      title={`Add "${s}"`}
                    >
                      + {s}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.documentsRequired || []).map((doc, index) => (
                    <span
                      key={`${doc}-${index}`}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {doc}
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="ml-2 text-purple-700 hover:text-purple-900"
                        aria-label={`Remove ${doc}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Custom Application Questions</h3>
                <p className="text-sm text-gray-600">Add custom questions to gather specific information from applicants</p>
              </div>
              <button type="button" onClick={addCustomQuestion} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center">
                <Plus size={14} className="mr-1" />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {formData.customQuestions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <GripVertical size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                    </div>
                    <button type="button" onClick={() => removeCustomQuestion(question.id)} className="text-red-600 hover:text-red-800">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateCustomQuestion(question.id, "question", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                        placeholder="Enter your question here..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Answer Type</label>
                        <select
                          value={question.type}
                          onChange={(e) => updateCustomQuestion(question.id, "type", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                        >
                          {questionTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required</label>
                        <select
                          value={String(question.required)}
                          onChange={(e) => updateCustomQuestion(question.id, "required", e.target.value === "true")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>

                    {question.type === "multiple-choice" && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Answer Options</label>
                          <button type="button" onClick={() => addOption(question.id)} className="text-sm text-green-600 hover:text-green-800">
                            Add Option
                          </button>
                        </div>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <button type="button" onClick={() => removeOption(question.id, optionIndex)} className="text-red-600 hover:text-red-800">
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {formData.customQuestions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-600 mb-4">No custom questions added yet</p>
                  <button type="button" onClick={addCustomQuestion} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center mx-auto">
                    <Plus size={14} className="mr-1" />
                    Add Your First Question
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex justify-between items-center">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>

          <div className="flex space-x-3">
            <button type="button" onClick={() => setIsPreview(true)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Eye size={14} className="mr-1" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} className="mr-1" />
                  Save Draft
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={!canPublish || isSubmitting}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              title={!canPublish ? "Fill required fields and ensure session has access_token + employee_id" : undefined}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={14} className="mr-1" />
                  Publish Job
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewJobPost;