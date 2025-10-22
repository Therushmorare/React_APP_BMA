const filterEmployees = (employees, filters, searchQuery) => {
  return employees.filter(emp => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        emp.name?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        emp.phone?.toLowerCase().includes(query) ||
        emp.jobTitle?.toLowerCase().includes(query) ||
        emp.department?.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    if (filters.jobTitle && emp.jobTitle !== filters.jobTitle) {
      return false;
    }

    if (filters.status && emp.status?.toLowerCase() !== filters.status) {
      return false;
    }

    if (filters.account) {
      if (filters.account === 'active' && emp.status?.toLowerCase() !== 'active') return false;
      if (filters.account === 'not-active' && emp.status?.toLowerCase() !== 'inactive') return false;
      if (filters.account === 'delete' && emp.status?.toLowerCase() !== 'pending deactivation') return false;
    }

    return true;
  });
};

const paginateData = (data, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};

export { filterEmployees, paginateData };