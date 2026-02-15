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

      const [
        applicantsRes,
        interviewsRes,
        postsRes,
        totalAppliedRes,
        totalPostsRes,
        totalOpenRes
      ] = await Promise.all([
        fetch(`${base}/api/hr/all_applicants`),
        fetch(`${base}/api/hr/allInterviews`),
        fetch(`${base}/api/candidate/allPosts`),
        fetch(`${base}/api/candidate/totalApplied`),
        fetch(`${base}/api/candidate/totalJobPosts`),
        fetch(`${base}/api/candidate/totalOpenPositions`)
      ]);

      if (
        !applicantsRes.ok ||
        !interviewsRes.ok ||
        !postsRes.ok
      ) {
        throw new Error("Failed to fetch reports data");
      }

      const applicants = await applicantsRes.json();
      const interviews = await interviewsRes.json();
      const posts = await postsRes.json();
      const totalApplied = await totalAppliedRes.json();
      const totalPosts = await totalPostsRes.json();
      const totalOpen = await totalOpenRes.json();

      const totalApplications = Array.isArray(applicants)
        ? applicants.length
        : 0;

      const totalInterviews = Array.isArray(interviews)
        ? interviews.length
        : 0;

      const completedInterviews = interviews?.filter(
        i => i.status?.toLowerCase() === "completed"
      )?.length || 0;

      const totalOffers = applicants?.filter(
        a => a.status?.toLowerCase() === "offered"
      )?.length || 0;

      const totalHires = applicants?.filter(
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

      // ----------------------------
      // KPI DATA
      // ----------------------------
      const kpiData = {
        totalApplications,
        applicationToInterview,
        interviewToOffer,
        offerAcceptance,
        averageTimeToHire: 30 // until backend provides real metric
      };

      // ----------------------------
      // FUNNEL DATA
      // ----------------------------
      const funnelData = [
        { stage: "Applications", count: totalApplications, percentage: 100 },
        {
          stage: "Interviews",
          count: totalInterviews,
          percentage: applicationToInterview
        },
        {
          stage: "Offers",
          count: totalOffers,
          percentage: interviewToOffer
        },
        {
          stage: "Hires",
          count: totalHires,
          percentage: offerAcceptance
        }
      ];

      // ----------------------------
      // PERFORMANCE TABLE (Grouped by Position)
      // ----------------------------
      const performanceMap = {};

      applicants?.forEach(app => {
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

        if (app.status?.toLowerCase() === "interviewed") {
          performanceMap[position].interviews++;
        }

        if (app.status?.toLowerCase() === "offered") {
          performanceMap[position].offers++;
        }

        if (app.status?.toLowerCase() === "hired") {
          performanceMap[position].hires++;
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
      setError(err.message);
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