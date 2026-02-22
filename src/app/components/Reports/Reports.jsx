"use client"

import React, { useState, useEffect } from 'react';
import ReportsHeader from './ReportsHeader';
import LoadingState from './LoadingState';
import ReportsFilters from './ReportsFilters';
import KPICards from './ReportsCards';
import RecruitmentFunnelChart from './Chart';
import PerformanceTable from './ReportsTable';

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    dateRange: 'month',
    department: '',
    position: ''
  });

  const [chartFilter, setChartFilter] = useState('30');
  const [reportData, setReportData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const base = "https://jellyfish-app-z83s2.ondigitalocean.app";
      const token = sessionStorage.getItem("access_token");

      const safeFetch = async (url) => {
        try {
          const res = await fetch(url, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      };

      // FETCH ALL DATA SOURCES
      const [applicantsRaw, interviewsRaw, employeesRaw, offersRaw, jobsRaw] = await Promise.all([
        safeFetch(`${base}/api/hr/all_applicants`),
        safeFetch(`${base}/api/hr/allInterviews`),
        safeFetch(`${base}/api/hr/allEmployees`),
        safeFetch(`${base}/api/hr/allOffers`),
        safeFetch(`${base}/api/candidate/allPosts`) // <-- Fetch job posts
      ]);

      const applicants = Array.isArray(applicantsRaw)
        ? applicantsRaw
        : applicantsRaw?.data || [];

      const interviews = Array.isArray(interviewsRaw)
        ? interviewsRaw
        : interviewsRaw?.data || [];

      const employees = employeesRaw?.employee_data || [];
      const offers = Array.isArray(offersRaw)
        ? offersRaw
        : offersRaw?.data || [];

      const jobs = jobsRaw?.jobs || [];

      // BUILD JOB MAPPING (job_id => expected_candidates or job_title)
      const jobMap = {};
      jobs.forEach(job => {
        if (job.job_id) {
          jobMap[job.job_id] = job.expected_candidates || job.job_title || "Unknown";
        }
      });

      // BUILD DYNAMIC FILTER OPTIONS FROM APPLICANTS
      if (Array.isArray(applicants)) {
        const uniqueDepartments = [
          ...new Set(applicants.map(a => a.department).filter(Boolean))
        ];

        const uniquePositions = [
          ...new Set(
            applicants.map(a => {
              // Use jobMap to get real position if missing
              return a.job_code || a.position || jobMap[a.job_id] || null;
            }).filter(Boolean)
          )
        ];

        setDepartments(uniqueDepartments);
        setPositions(uniquePositions);
      }

      // APPLY FILTERS TO APPLICANTS
      let filteredApplicants = [...applicants];

      if (filters.department) {
        filteredApplicants = filteredApplicants.filter(
          a => a.department?.toLowerCase() === filters.department.toLowerCase()
        );
      }

      if (filters.position) {
        filteredApplicants = filteredApplicants.filter(
          a => {
            const pos = a.job_code || a.position || jobMap[a.job_id] || "";
            return pos.toLowerCase() === filters.position.toLowerCase();
          }
        );
      }

      const totalApplications = filteredApplicants.length;

      const applicantIds = new Set(filteredApplicants.map(a => a.applicant_id));

      // FILTER INTERVIEWS
      const filteredInterviews = interviews.filter(interview =>
        applicantIds.has(interview.candidate_id)
      );
      const totalInterviews = filteredInterviews.length;

      // FILTER OFFERS
      const filteredOffers = offers.filter(offer =>
        applicantIds.has(offer.candidate_id)
      );
      const totalOffers = filteredOffers.length;

      // FILTER HIRES
      const filteredHires = employees.filter(emp =>
        applicantIds.has(emp.candidate_id)
      );
      const totalHires = filteredHires.length;

      // CONVERSION RATES
      const applicationToInterview = totalApplications
        ? Math.round((totalInterviews / totalApplications) * 100)
        : 0;

      const interviewToOffer = totalInterviews
        ? Math.round((totalOffers / totalInterviews) * 100)
        : 0;

      const offerAcceptance = totalOffers
        ? Math.round((totalHires / totalOffers) * 100)
        : 0;

      const kpiData = {
        totalApplications,
        applicationToInterview,
        interviewToOffer,
        offerAcceptance,
        averageTimeToHire: 30
      };

      const funnelData = [
        { stage: "Applications", count: totalApplications, percentage: 100 },
        { stage: "Interviews", count: totalInterviews, percentage: applicationToInterview },
        { stage: "Offers", count: totalOffers, percentage: interviewToOffer },
        { stage: "Hires", count: totalHires, percentage: offerAcceptance }
      ];

      // PERFORMANCE BY POSITION
      const performanceMap = {};

      filteredApplicants.forEach(app => {
        const position = app.job_code || app.position || jobMap[app.job_id] || "Unknown";

        if (!performanceMap[position]) {
          performanceMap[position] = {
            position,
            applicants: 0,
            interviews: 0,
            offers: 0,
            hires: 0
          };
        }

        // Increment applicants count, not the object
        performanceMap[position].applicants++;
      });

      // COUNT INTERVIEWS
      filteredInterviews.forEach(interview => {
        const applicant = filteredApplicants.find(
          app => app.applicant_id === interview.candidate_id
        );

        if (applicant) {
          const position = applicant.job_code || applicant.position || jobMap[applicant.job_id] || "Unknown";
          if (performanceMap[position]) {
            performanceMap[position].interviews++;
          }
        }
      });

      // COUNT OFFERS
      filteredOffers.forEach(offer => {
        const applicant = filteredApplicants.find(
          app => app.applicant_id === offer.candidate_id
        );

        if (applicant) {
          const position = applicant.job_code || applicant.position || jobMap[applicant.job_id] || "Unknown";
          if (performanceMap[position]) {
            performanceMap[position].offers++;
          }
        }
      });

      // COUNT HIRES
      filteredHires.forEach(emp => {
        const applicant = filteredApplicants.find(
          app => app.applicant_id === emp.candidate_id
        );

        if (applicant) {
          const position = applicant.job_code || applicant.position || jobMap[applicant.job_id] || "Unknown";
          if (performanceMap[position]) {
            performanceMap[position].hires++;
          }
        }
      });

      const performanceData = Object.values(performanceMap).map(p => {
        const conversionRate = p.applicants
          ? ((p.hires / p.applicants) * 100).toFixed(1)
          : 0;

        let performance = "Average";
        if (conversionRate > 15) performance = "Excellent";
        else if (conversionRate > 10) performance = "Good";
        else if (conversionRate < 5) performance = "Bad";

        return {
          ...p,
          conversionRate,
          avgTimeToHire: 30,
          performance
        };
      });

      setReportData({
        kpi_data: kpiData,
        funnel_data: funnelData,
        performance_data: performanceData
      });

    } catch (err) {
      console.error("Reports error:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [filters, chartFilter]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async (format = 'json') => {
    if (!reportData) {
      alert("No report data to export");
      return;
    }

    setExporting(true);

    try {
      let blob;
      let filename = `recruitment-report-${Date.now()}.${format}`;

      if (format === 'json' || format === 'excel') {
        const jsonStr = JSON.stringify(reportData, null, 2);
        blob = new Blob([jsonStr], { type: "application/json" });
      } else if (format === 'pdf') {
        const jsonStr = JSON.stringify(reportData, null, 2);
        blob = new Blob([jsonStr], { type: "application/pdf" });
      } else {
        alert("Unsupported format");
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      case 'bad':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <ReportsHeader 
        error={error}
        exporting={exporting}
        handleExport={handleExport}
      />

      <ReportsFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        fetchReportData={fetchReportData}
        setFilters={setFilters}
        departments={departments}
        positions={positions}
      />

      {reportData && (
        <>
          <KPICards kpiData={reportData.kpi_data} />

          <RecruitmentFunnelChart
            funnelData={reportData.funnel_data}
            chartFilter={chartFilter}
            setChartFilter={setChartFilter}
          />

          <PerformanceTable
            performanceData={reportData.performance_data}
            getPerformanceColor={getPerformanceColor}
          />
        </>
      )}
    </div>
  );
};

export default ReportsPage;