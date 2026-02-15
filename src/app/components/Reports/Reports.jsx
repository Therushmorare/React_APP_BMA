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

      const applicants = await safeFetch(`${base}/api/hr/all_applicants`);
      const interviews = await safeFetch(`${base}/api/hr/allInterviews`);
      const posts = await safeFetch(`${base}/api/candidate/allPosts`);
      const totalApplied = await safeFetch(`${base}/api/candidate/totalApplied`);
      const totalPosts = await safeFetch(`${base}/api/candidate/totalJobPosts`);
      const totalOpen = await safeFetch(`${base}/api/candidate/totalOpenPositions`);

      console.log("Applicants:", applicants);
      console.log("Interviews:", interviews);

      const totalApplications = Array.isArray(applicants)
        ? applicants.length
        : applicants?.total || 0;

      const totalInterviews = Array.isArray(interviews)
        ? interviews.length
        : 0;

      const totalOffers = applicants?.filter?.(
        a => a.status?.toLowerCase() === "offered"
      )?.length || 0;

      const totalHires = applicants?.filter?.(
        a => a.status?.toLowerCase() === "hired"
      )?.length || 0;

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

      if (Array.isArray(applicants)) {
        applicants.forEach(app => {
          const position = app.job_code || "Unknown";

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
      }

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

  const handleExport = async (format = 'pdf') => {
    setExporting(true);
    
    try {
      const params = new URLSearchParams({
        ...filters,
        format,
        chart_period: chartFilter
      });
      
      const response = await fetch(`/api/reports/export/recruitment-summary?${params}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `recruitment-report-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
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
    return <LoadingState  />;
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