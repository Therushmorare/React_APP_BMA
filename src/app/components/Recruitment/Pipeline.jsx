"use client";

import React, { useEffect, useState } from "react";

const PipelineModal = ({ selectedJob }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedJob?.job_id) return;

    const fetchPipelineData = async () => {
      setLoading(true);

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

          if (!res.ok) return [];
          return await res.json();
        } catch {
          return [];
        }
      };

      try {
        const applicantsRaw = await safeFetch(`${base}/api/hr/all_applicants`);
        const interviewsRaw = await safeFetch(`${base}/api/hr/allInterviews`);
        const offersRaw = await safeFetch(`${base}/api/hr/allOffers`);

        const applicants = Array.isArray(applicantsRaw)
          ? applicantsRaw
          : applicantsRaw?.data || [];

        const interviews = Array.isArray(interviewsRaw)
          ? interviewsRaw
          : interviewsRaw?.data || [];

        const offers = Array.isArray(offersRaw)
          ? offersRaw
          : offersRaw?.data || [];

        // 🔥 Filter by job_id
        const jobApplicants = applicants.filter(
          (a) => a.job_id === selectedJob.job_id
        );

        const jobInterviews = interviews.filter(
          (i) => i.job_id === selectedJob.job_id
        );

        const jobOffers = offers.filter(
          (o) => o.job_id === selectedJob.job_id
        );

        const totalApplicants = jobApplicants.length;
        const inReview = jobApplicants.filter(
          (a) => a.status?.toUpperCase() === "REVIEW"
        ).length;
        const totalInterviews = jobInterviews.length;
        const totalOffers = jobOffers.length;

        const interviewRate = totalApplicants
          ? Math.round((totalInterviews / totalApplicants) * 100)
          : 0;

        const offerRate = totalInterviews
          ? Math.round((totalOffers / totalInterviews) * 100)
          : 0;

        setStats({
          totalApplicants,
          inReview,
          totalInterviews,
          totalOffers,
          interviewRate,
          offerRate,
        });
      } catch (err) {
        console.error("Pipeline error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelineData();
  }, [selectedJob]);

  if (loading || !stats) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading pipeline analytics...
      </div>
    );
  }

  const stages = [
    {
      label: "Applications",
      value: stats.totalApplicants,
      color: "bg-blue-500",
      percentage: 100,
    },
    {
      label: "In Review",
      value: stats.inReview,
      color: "bg-yellow-500",
      percentage: stats.totalApplicants
        ? Math.round((stats.inReview / stats.totalApplicants) * 100)
        : 0,
    },
    {
      label: "Interviews",
      value: stats.totalInterviews,
      color: "bg-green-500",
      percentage: stats.interviewRate,
    },
    {
      label: "Offers",
      value: stats.totalOffers,
      color: "bg-purple-500",
      percentage: stats.offerRate,
    },
  ];

  return (
    <div className="space-y-6">
      {stages.map((stage, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">
              {stage.label}
            </span>
            <span className="text-gray-500">
              {stage.value} ({stage.percentage}%)
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${stage.color} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${stage.percentage}%` }}
            />
          </div>
        </div>
      ))}

      {/* Conversion Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border text-sm">
        <div className="flex justify-between">
          <span>Application → Interview</span>
          <span className="font-semibold">
            {stats.interviewRate}%
          </span>
        </div>
        <div className="flex justify-between mt-2">
          <span>Interview → Offer</span>
          <span className="font-semibold">
            {stats.offerRate}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PipelineModal;