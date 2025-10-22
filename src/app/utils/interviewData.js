export const generateSampleInterviews = (page, limit, search = '', filterParams = {}) => {
  const positions = [
    'Software Engineer', 'Senior Software Engineer', 'Product Manager', 'UI/UX Designer',
    'Data Analyst', 'Marketing Specialist', 'Sales Representative', 'HR Specialist',
    'DevOps Engineer', 'Quality Assurance', 'Business Analyst', 'Project Manager'
  ];

  const names = [ 'Nombuso Dlamini', 'Sipho Mthembu', 'Thandiwe Nkosi', 'Lerato Khumalo', 'Anele Zulu', 'Sibusiso Mokoena', 'Zinhle Dube', 'Kagiso Molefe', 'Palesa Msimang', 'Themba Ndlovu' ];
  
  const statuses = ['Upcoming', 'Completed', 'Rescheduled', 'Cancelled'];
  const interviewers = ['John Smith', 'Alice Brown', 'Bob Wilson', 'Sarah Davis', 'Mike Johnson', 'Emma Taylor'];
  const types = ['Internal', 'External'];

  const allInterviews = [];
  for (let i = 1; i <= 500; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const interviewer = interviewers[Math.floor(Math.random() * interviewers.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
    
    allInterviews.push({
      id: i,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: `+27 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      position,
      date: futureDate.toISOString().split('T')[0],
      time: `${String(Math.floor(Math.random() * 8) + 9).padStart(2, '0')}:${Math.random() < 0.5 ? '00' : '30'}`,
      status,
      interviewer,
      type,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=ffffff&size=128`,
      notes: `Interview notes for ${name}. Candidate has ${Math.floor(Math.random() * 10) + 1} years of experience.`,
      resumeUrl: `https://example.com/resume/${i}.pdf`
    });
  }

  let filteredInterviews = allInterviews;

  if (search) {
    filteredInterviews = filteredInterviews.filter(interview => 
      interview.name.toLowerCase().includes(search.toLowerCase()) ||
      interview.position.toLowerCase().includes(search.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filterParams.status) {
    filteredInterviews = filteredInterviews.filter(interview => interview.status === filterParams.status);
  }

  if (filterParams.position) {
    filteredInterviews = filteredInterviews.filter(interview => 
      interview.position.toLowerCase().includes(filterParams.position.toLowerCase())
    );
  }

  if (filterParams.type) {
    filteredInterviews = filteredInterviews.filter(interview => interview.type === filterParams.type);
  }

  if (filterParams.dateRange) {
    const today = new Date();
    const filterDate = new Date(today);
    
    switch (filterParams.dateRange) {
      case 'today':
        filteredInterviews = filteredInterviews.filter(interview => 
          interview.date === today.toISOString().split('T')[0]
        );
        break;
      case 'week':
        filterDate.setDate(today.getDate() + 7);
        filteredInterviews = filteredInterviews.filter(interview => 
          new Date(interview.date) <= filterDate
        );
        break;
      case 'month':
        filterDate.setMonth(today.getMonth() + 1);
        filteredInterviews = filteredInterviews.filter(interview => 
          new Date(interview.date) <= filterDate
        );
        break;
    }
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedInterviews = filteredInterviews.slice(startIndex, endIndex);

  return {
    interviews: paginatedInterviews,
    total: filteredInterviews.length,
    page,
    totalPages: Math.ceil(filteredInterviews.length / limit)
  };
};