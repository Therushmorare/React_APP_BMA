export const filterCandidates = (candidates, searchQuery, filters) => {
  return candidates.filter(candidate => {
    const matchesSearch = searchQuery === '' || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDateRange = filters.dateRange === '' || (() => {
      const candidateDate = new Date(candidate.createdAt);
      const now = new Date();
      switch (filters.dateRange) {
        case 'today':
          return candidateDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return candidateDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return candidateDate >= monthAgo;
        case 'quarter':
          const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          return candidateDate >= quarterAgo;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return candidateDate >= yearAgo;
        default:
          return true;
      }
    })();

    const matchesStatus = filters.status === '' || candidate.stage.toLowerCase() === filters.status.toLowerCase();
    const matchesPosition = filters.position === '' || candidate.position.toLowerCase().includes(filters.position.toLowerCase());
    const matchesType = filters.type === '' || candidate.type === filters.type;
    const matchesExperience = filters.experience === '' || candidate.experienceYears >= parseInt(filters.experience);

    return matchesSearch && matchesDateRange && matchesStatus && matchesPosition && matchesType && matchesExperience;
  });
};

export const sortCandidates = (candidates, sortConfig) => {
  if (!sortConfig.key) return candidates;

  return [...candidates].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'experienceYears') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (sortConfig.key === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};