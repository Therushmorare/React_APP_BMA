"use client"

import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import InterviewFilters from './InterviewFilters';
import InterviewTable from './InterviewsTable';
import Pagination from './Pagination';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import InterviewDetailsModal from './InterviewDetails';
import { generateSampleInterviews } from '@/app/utils/interviewData';


const INTERVIEWS_PER_PAGE = 20;

const Interviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: '',
    status: '',
    position: '',
    type: ''
  });

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInterviews, setTotalInterviews] = useState(0);
  
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const fetchInterviews = useCallback(async (page = 1, search = '', filterParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = generateSampleInterviews(page, INTERVIEWS_PER_PAGE, search, filterParams);

      setInterviews(data.interviews);
      setTotalInterviews(data.total);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    _.debounce((query, currentFilters) => {
      fetchInterviews(1, query, currentFilters);
    }, 500),
    []
  );

  useEffect(() => {
    fetchInterviews(1, searchQuery, filters);
  }, []);

  useEffect(() => {
    debouncedSearch(searchQuery, filters);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    if (currentPage === 1) {
      fetchInterviews(1, searchQuery, filters);
    } else {
      setCurrentPage(1);
      fetchInterviews(1, searchQuery, filters);
    }
  }, [filters, fetchInterviews]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchInterviews(page, searchQuery, filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleInterviewAction = async (interviewId, action) => {
    setActionLoading(prev => ({ ...prev, [interviewId]: true }));

    try {
      let newStatus;
      switch (action) {
        case 'complete':
          newStatus = 'Completed';
          break;
        case 'reschedule':
          newStatus = 'Rescheduled';
          break;
        case 'cancel':
          newStatus = 'Cancelled';
          break;
        default:
          return;
      }

      setInterviews(prev => 
        prev.map(interview => 
          interview.id === interviewId 
            ? { ...interview, status: newStatus }
            : interview
        )
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Interview ${interviewId} ${action} completed`);
      
    } catch (err) {
      fetchInterviews(currentPage, searchQuery, filters);
      console.error(`Failed to ${action} interview:`, err);
    } finally {
      setActionLoading(prev => ({ ...prev, [interviewId]: false }));
    }
  };

  const handleViewInterview = (interview) => {
    setSelectedInterview(interview);
    setShowModal(true);
  };

     return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Interviews</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          Manage interviews and schedule meetings - {totalInterviews.toLocaleString()} total interviews
        </p>
      </div>

      {/* Filters */}
      <InterviewFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        totalInterviews={totalInterviews}
        currentPage={currentPage}
        itemsPerPage={INTERVIEWS_PER_PAGE}
      />

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error State */}
      {error && <ErrorState error={error} />}

      {/* Interview Table */}
      {!loading && !error && (
        <>
          <InterviewTable
            interviews={interviews}
            onAction={handleInterviewAction}
            onView={handleViewInterview}
            actionLoading={actionLoading}
          />

          {/* Pagination */}
          <div className="mt-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* Interview Details Modal */}
      {showModal && selectedInterview && (
        <InterviewDetailsModal
          interview={selectedInterview}
          onClose={() => setShowModal(false)}
          onAction={handleInterviewAction}
        />
      )}
    </div>
  );
};

export default Interviews;