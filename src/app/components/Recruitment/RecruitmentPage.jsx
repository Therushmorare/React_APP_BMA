"use client"

import React, { useState } from 'react';
import JobPostHeader from './JobHeader';
import JobsGrid from './JobsGrid';
import Modal from '../Recruitment/Modal'; 
import FeedbackModal from './Feedback';
import PipelineModal from './Pipeline';
import JobDetailsModal from './JobDetails'; 
import NewJobPost from '@/app/features/Recruitment/NewJobPost'

const JobPosts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: '',
    status: '',
    department: '',
    type: ''
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      status: "Active",
      applicants: 24,
      createdAt: "2025-09-10",
      type: "Full-time",
      location: "Johannesburg, South Africa",
      description: "We are looking for a senior software engineer to join our growing team..."
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      status: "Draft",
      applicants: 19,
      createdAt: "2025-09-15",
      type: "Full-time",
      location: "Cape Town, South Africa",
      description: "Lead product strategy and development for our core platform..."
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      status: "Active",
      applicants: 18,
      createdAt: "2025-09-08",
      type: "Contract",
      location: "Remote",
      description: "Create beautiful and intuitive user experiences for our products..."
    },
    {
      id: 4,
      title: "Data Analyst",
      department: "Analytics",
      status: "Paused",
      applicants: 12,
      createdAt: "2025-09-05",
      type: "Full-time",
      location: "Durban, South Africa",
      description: "Analyze data to drive business insights and decision-making..."
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      status: "Active",
      applicants: 31,
      createdAt: "2025-09-01",
      type: "Full-time",
      location: "Johannesburg, South Africa",
      description: "Develop and execute marketing campaigns to grow our brand..."
    },
    {
      id: 6,
      title: "Sales Representative",
      department: "Sales",
      status: "Closed",
      applicants: 45,
      createdAt: "2025-08-28",
      type: "Full-time",
      location: "Pretoria, South Africa",
      description: "Drive sales growth and build relationships with enterprise clients..."
    }
  ]);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'with filters:', filters);
  };

  const handleStatusChange = (jobId, newStatus) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
    setActiveDropdown(null);
  };

  const handleMenuClick = (job, action) => {
    setSelectedJob(job);
    setModalType(action);
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleNewJobSave = (newJob) => {
    const jobWithLocation = {
      ...newJob,
      location: newJob.locationType === 'onsite' ? newJob.city : newJob.locationType
    };
    setJobs([jobWithLocation, ...jobs]);
    console.log('New job added:', jobWithLocation);
  };

  const handleJobCardClick = (job) => {
    if (job.status === 'Draft') {
      setSelectedJob(job);
      setModalType('editJob');
      setShowModal(true);
    }
  };

  const handleEditJobSave = (updatedJob) => {
    setJobs(jobs.map(job => 
      job.id === selectedJob.id ? updatedJob : job
    ));
    console.log('Job updated:', updatedJob);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <JobPostHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        setModalType={setModalType}
        setShowModal={setShowModal}
      />

      <JobsGrid
        jobs={jobs}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        handleStatusChange={handleStatusChange}
        handleMenuClick={handleMenuClick}
        handleJobCardClick={handleJobCardClick}
        getStatusColor={getStatusColor}
      />

      {/* Modals */}
      <Modal
        isOpen={showModal && modalType === 'feedback'}
        onClose={() => setShowModal(false)}
        title={`Feedback for ${selectedJob?.title}`}
        position="right"
      >
        <FeedbackModal />
      </Modal>

      <Modal
        isOpen={showModal && modalType === 'pipeline'}
        onClose={() => setShowModal(false)}
        title={`Pipeline for ${selectedJob?.title}`}
        position="right"
      >
        <PipelineModal selectedJob={selectedJob} />
      </Modal>

      <Modal
        isOpen={showModal && modalType === 'fullJob'}
        onClose={() => setShowModal(false)}
        title={selectedJob?.title || 'Job Details'}
        position="right"
      >
        <JobDetailsModal selectedJob={selectedJob} getStatusColor={getStatusColor} />
      </Modal>

      <Modal
        isOpen={showModal && modalType === 'createJob'}
        onClose={() => setShowModal(false)}
        title="Create New Job Post"
        position="form"
      >
        <NewJobPost 
          onClose={() => setShowModal(false)} 
          onSave={handleNewJobSave}
        />
      </Modal>

      <Modal
        isOpen={showModal && modalType === 'editJob'}
        onClose={() => setShowModal(false)}
        title={`Edit Draft - ${selectedJob?.title}`}
        position="form"
      >
        <NewJobPost 
          onClose={() => setShowModal(false)} 
          onSave={handleEditJobSave}
          existingJob={selectedJob}
        />
      </Modal>
    </div>
  );
};

export default JobPosts;