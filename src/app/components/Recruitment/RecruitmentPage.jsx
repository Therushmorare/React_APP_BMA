"use client"

import React, { useState, useEffect } from 'react';
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

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     FETCH JOBS FROM API
  ========================== */
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          'https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/allPosts'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();

        const formattedJobs = data.jobs.map((job) => {
          const filter = job.filters?.[0] || {};

          return {
            id: job.job_id,
            title: job.expected_candidates || job.job_title,
            department: job.department,
            status: formatStatus(job.status),
            applicants: job.quantity || 0,
            createdAt: job.created_at,
            type: job.employment_type?.replace('_', '-'),
            location: job.office,
            description: job.job_description,
            closing: job.closing_date,

            experience: filter.experience,
            expectedQualification: filter.expected_qualification,
            salary: filter.salary
          };
        });

        setJobs(formattedJobs);
      } catch (err) {
        console.error(err);
        setError('Unable to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* =========================
     STATUS NORMALIZER
  ========================== */
  const formatStatus = (status) => {
    switch (status) {
      case 'REVIEW':
        return 'Draft';
      case 'OPEN':
        return 'Active';
      case 'CLOSED':
        return 'Closed';
      default:
        return 'Paused';
    }
  };

  /* =========================
     EXISTING LOGIC (UNCHANGED)
  ========================== */
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

      {loading && <p className="text-gray-500 mb-4">Loading jobs...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

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