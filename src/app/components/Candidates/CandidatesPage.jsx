"use client"

import React, { useState, useMemo, useEffect } from 'react';
import CandidateFilters from './CandidatesFilters';
import CandidateTable from './CandidatesTable';
import CandidatePagination from './CandidatesPagination';
import CandidateDetailsPanel from '../../features/Candidates/CandidatePanel';
import { filterCandidates, sortCandidates } from '@/app/utils/candidateData';

const ITEMS_PER_PAGE = 20;

/* Map backend applicant → frontend candidate format */
const mapApplicantToCandidate = (applicant, resumes = []) => {
  const fullName = `${applicant.first_name} ${applicant.last_name}`;
  return {
    id: applicant.applicant_id,
    jobCode: applicant.job_id,
    name: fullName,
    email: applicant.email,
    phone: applicant.phone_number,
    position: "Candidate",
    stage: applicant.application_status,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=22c55e&color=ffffff&size=128`,
    resumes, // <-- attach resumes here
    createdAt: applicant.applied_at?.split("T")[0],
    experienceYears: 0,
    qualifications: applicant.professional_summary || "N/A",
    type: "external",
    answers: {
      whyCompany: applicant.professional_summary || "N/A",
      strengths: "N/A",
      availability: "N/A"
    }
  };
};

const CandidatesPage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: '',
    status: '',
    position: '',
    type: '',
    experience: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const [allCandidates, setAllCandidates] = useState([]);
  const [screeningCandidates, setScreeningCandidates] = useState([]); // NEW: Screening stage
  const [loading, setLoading] = useState(true);

  /* Fetch real applicants from backend */
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(
          "https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/all_applicants",
          { method: "GET", headers: { Accept: "application/json" } }
        );
        if (!response.ok) throw new Error("Failed to fetch applicants");

        const data = await response.json();

        // Fetch resumes for each applicant in parallel
        const candidates = await Promise.all(
          data.map(async (applicant) => {
            const resumes = await fetchApplicantResumes(applicant.applicant_id);
            return mapApplicantToCandidate(applicant, resumes);
          })
        );

        setAllCandidates(candidates);

        // Filter only SCREENING stage candidates
        const screening = candidates.filter(c => c.stage?.toUpperCase() === "SCREENING" || c.stage?.toUpperCase() === "READY_TO_INTERVIEW");
        setScreeningCandidates(screening);

      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const fetchApplicantResumes = async (applicantId) => {
    try {
      const res = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/candidate/myApplications/${applicantId}`
      );
      if (!res.ok) throw new Error("Failed to fetch applicant resumes");

      const data = await res.json();
      return data.resumes || []; // Return the resumes array
    } catch (err) {
      console.error("Error fetching resumes for applicant:", applicantId, err);
      return [];
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = () => setCurrentPage(1);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedCandidate(null);
  };

  const handleDeleteCandidate = (candidateId) => {
    console.log('Deleting candidate:', candidateId);
  };

  const handleUpdateCandidate = (candidateId, updates) => {
    console.log('Updating candidate:', candidateId, updates);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Filter & sort only SCREENING candidates */
  const filteredAndSortedCandidates = useMemo(() => {
    const filtered = filterCandidates(screeningCandidates, searchQuery, filters);
    return sortCandidates(filtered, sortConfig);
  }, [screeningCandidates, searchQuery, filters, sortConfig]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedCandidates.slice(startIndex, endIndex);
  }, [filteredAndSortedCandidates, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedCandidates.length / ITEMS_PER_PAGE);

  /* Loading State */
  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-sm">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Candidates (Screening)</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          Review and manage candidates currently in the SCREENING stage.
        </p>
      </div>

      {/* Filters */}
      <CandidateFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        totalCandidates={filteredAndSortedCandidates.length}
      />

      {/* Table */}
      <CandidateTable
        candidates={paginatedCandidates}
        sortConfig={sortConfig}
        onSort={handleSort}
        onViewCandidate={handleViewCandidate}
        onDeleteCandidate={handleDeleteCandidate}
      />

      {/* Pagination */}
      {totalPages > 0 && (
        <CandidatePagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredAndSortedCandidates.length}
          onPageChange={handlePageChange}
        />
      )}

      {/* Details Panel */}
      {selectedCandidate && isPanelOpen && (
        <CandidateDetailsPanel
          candidate={selectedCandidate}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
          onSuccess={handleUpdateCandidate}
        />
      )}
    </div>
  );
};

export default CandidatesPage;