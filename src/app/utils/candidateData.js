export const generateSampleCandidates = (count = 100) => {
  const positions = [
    'Software Engineer', 'Senior Software Engineer', 'Product Manager', 'UI/UX Designer',
    'Data Analyst', 'Marketing Specialist', 'Sales Representative', 'HR Specialist',
    'DevOps Engineer', 'Quality Assurance', 'Business Analyst', 'Project Manager'
  ];
  
  const stages = ['Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
  const types = ['internal', 'external'];
  
  const firstNames = ['Nombuso', 'Zandile', 'Lebogang', 'Avethandwa', 'Thuba', 'Sani', 'Kgotso', 'Mpho', 'Naledi', 'Tshepo'];
  const lastNames = ['Simelane', 'Dlamini', 'Malatjei', 'Mpembe', 'Sibisi', 'Pasi', 'Mokoena', 'Nkosi', 'Radebe', 'Khumalo'];

  const candidates = [];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const position = positions[Math.floor(Math.random() * positions.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const experienceYears = Math.floor(Math.random() * 15) + 1;
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 365));
    
    candidates.push({
      id: i,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+278 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      position,
      cv: `${firstName.toLowerCase()}_${lastName.toLowerCase()}_cv.pdf`,
      createdAt: pastDate.toISOString().split('T')[0],
      stage,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=ffffff&size=128`,
      experienceYears,
      qualifications: `BSc ${position.split(' ')[0]}, Professional Certifications`,
      type,
      answers: {
        whyCompany: "Passionate about innovation and growth opportunities",
        strengths: "Problem-solving, leadership, and technical expertise",
        availability: stage === 'Hired' ? 'Hired' : `${Math.floor(Math.random() * 4) + 1} weeks notice`
      }
    });
  }
  
  return candidates;
};

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