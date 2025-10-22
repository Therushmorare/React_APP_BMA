"use client"

import React, { useState, useMemo } from 'react';
import CandidateFilters from './CandidatesFilters';
import CandidateTable from './CandidatesTable';
import CandidatePagination from './CandidatesPagination';
import CandidateDetailsPanel from '../../features/Candidates/CandidatePanel';
import { generateSampleCandidates, filterCandidates, sortCandidates } from '@/app/utils/candidateData';

const ITEMS_PER_PAGE = 20;
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
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); 
  };

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const allCandidates = useMemo(() => generateSampleCandidates(3678), []);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'with filters:', filters);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
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

  const filteredAndSortedCandidates = useMemo(() => {
    const filtered = filterCandidates(allCandidates, searchQuery, filters);
    return sortCandidates(filtered, sortConfig);
  }, [allCandidates, searchQuery, filters, sortConfig]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedCandidates.slice(startIndex, endIndex);
  }, [filteredAndSortedCandidates, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedCandidates.length / ITEMS_PER_PAGE);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Candidates</h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          Manage and review all candidate applications.
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

      {/* Candidates Table */}
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

      {/* Candidate Detail Panel */}
      <CandidateDetailsPanel
        candidate={selectedCandidate}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onUpdate={handleUpdateCandidate}
      />
    </div>
  );
};

export default CandidatesPage;