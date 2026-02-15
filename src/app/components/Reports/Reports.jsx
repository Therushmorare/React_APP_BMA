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
  const [departments, setDepartments] = useState([]);   // ✅ ADDED
  const [positions, setPositions] = useState([]);       // ✅ ADDED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const base = "https://jellyfish-app-z83s2.ondigitalocean.app";

      const safeFetch = async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return [];
          return await res.json();
        } catch {
          return [];
        }
      };

      const applicantsRaw = await safeFetch(`${base}/api/hr/all_applicants`);
      const interviewsRaw = await safeFetch(`${base}/api/hr/allInterviews`);

      const applicants = Array.isArray(applicantsRaw)
        ? applicantsRaw
        : applicantsRaw?.data || [];

      const interviews = Array.isArray(interviewsRaw)
        ? interviewsRaw
        : interviewsRaw?.data || [];

      console.log("Applicants:", applicants);
      console.log("Interviews:", interviews);

      // ✅ BUILD DYNAMIC FILTER OPTIONS
      if (Array.isArray(applicants)) {
        const uniqueDepartments = [
          ...new Set(applicants.map(a => a.department).filter(Boolean))
        ];

        const uniquePositions = [
          ...new Set(
            applicants.map(a => a.job_code || a.position).filter(Boolean)
          )
        ];

        setDepartments(uniqueDepartments);
        setPositions(uniquePositions);
      }

      // ✅ APPLY FILTERS
      let filteredApplicants = [...applicants];

      if (filters.department) {
        filteredApplicants = filteredApplicants.filter(
          a =>
            a.department?.toLowerCase() ===
            filters.department.toLowerCase()
        );
      }

      if (filters.position) {
        filteredApplicants = filteredApplicants.filter(
          a =>
            a.job_code?.toLowerCase() ===
              filters.position.toLowerCase() ||
            a.position?.toLowerCase() ===
              filters.position.toLowerCase()
        );
      }

      const totalApplications = filteredApplicants.length;

      const totalInterviews = interviews.filter(interview =>
        filteredApplicants.some(
          app => app.id === interview.applicant_id
        )
      ).length;

      const totalOffers = filteredApplicants.filter(
        a => a.status?.toLowerCase() === "offered"
      ).length;

      const totalHires = filteredApplicants.filter(
        a => a.status?.toLowerCase() === "hired"
      ).length;

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

      const performanceMap = {};

      filteredApplicants.forEach(app => {
        const position = app.job_code || app.position || "Unknown";

        if (!performanceMap[position]) {
          performanceMap[position] = {
            position,
            applicants: 0,
            interviews: 0,
            offers: 0,
            hires: 0
          };
        }

        performanceMap[position].applicants++;

        if (app.status?.toLowerCase() === "interviewed")
          performanceMap[position].interviews++;

        if (app.status?.toLowerCase() === "offered")
          performanceMap[position].offers++;

        if (app.status?.toLowerCase() === "hired")
          performanceMap[position].hires++;
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
