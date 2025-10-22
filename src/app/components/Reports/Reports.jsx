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
      const params = new URLSearchParams({
        date_range: filters.dateRange,
        chart_period: chartFilter,
        ...(filters.department && { department: filters.department }),
        ...(filters.position && { position: filters.position })
      });

      const response = await fetch(`/api/reports/recruitment-metrics?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
      setReportData({
        kpi_data: {
          totalApplications: 2450,
          applicationToInterview: 68,
          interviewToOffer: 42,
          offerAcceptance: 89,
          averageTimeToHire: 28
        },
        funnel_data: [
          { stage: 'Applications', count: 2450, percentage: 100 },
          { stage: 'Screening', count: 1860, percentage: 76 },
          { stage: 'Interviews', count: 1250, percentage: 51 },
          { stage: 'Offers', count: 420, percentage: 17 },
          { stage: 'Hires', count: 380, percentage: 15 }
        ],
        performance_data: [
          {
            position: "Software Engineer",
            applicants: 890,
            interviews: 340,
            offers: 120,
            hires: 110,
            conversionRate: 12.4,
            avgTimeToHire: 32,
            performance: "Good"
          },
          {
            position: "Product Manager", 
            applicants: 560,
            interviews: 280,
            offers: 80,
            hires: 70,
            conversionRate: 12.5,
            avgTimeToHire: 25,
            performance: "Excellent"
          },
          {
            position: "UI/UX Designer",
            applicants: 420,
            interviews: 180,
            offers: 60,
            hires: 50,
            conversionRate: 11.9,
            avgTimeToHire: 29,
            performance: "Good"
          },
          {
            position: "Data Analyst",
            applicants: 350,
            interviews: 120,
            offers: 40,
            hires: 30,
            conversionRate: 8.6,
            avgTimeToHire: 45,
            performance: "Average"
          },
          {
            position: "Marketing Specialist",
            applicants: 230,
            interviews: 80,
            offers: 30,
            hires: 20,
            conversionRate: 8.7,
            avgTimeToHire: 38,
            performance: "Average"
          },
          {
            position: "Sales Representative",
            applicants: 180,
            interviews: 50,
            offers: 20,
            hires: 10,
            conversionRate: 5.6,
            avgTimeToHire: 52,
            performance: "Bad"
          }
        ]
      });
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