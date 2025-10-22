import React from 'react';
import JobCard from './JobCard';

const JobsGrid = ({ jobs, activeDropdown, setActiveDropdown, handleStatusChange, handleMenuClick, handleJobCardClick, getStatusColor }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          handleStatusChange={handleStatusChange}
          handleMenuClick={handleMenuClick}
          handleJobCardClick={handleJobCardClick}
          getStatusColor={getStatusColor}
        />
      ))}
    </div>
  );
};

export default JobsGrid;