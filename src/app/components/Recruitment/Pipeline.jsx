"use client";

import React, { useEffect, useState } from "react";

const PipelineModal = ({ selectedJob }) => {
  const [stats, setStats] = useState({
    applicants: 0,
    review: 0,
    interviews: 0,
    offers: 0,
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!selectedJob?.id) return;

    const fetchPipelineData = async () => {
      setLoading(true);

      const base = "https://jellyfish-app-z83s2.ondigitalocean.app";
      const token = sessionStorage.getItem("access_token");

      try {
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

        const interviewsRaw = await safeFetch(`${base}/api/hr/allInterviews`);
        const offersRaw = await safeFetch(`${base}/api/hr/allOffers`);
        const applicationsRaw = await safeFetch(`${base}/api/hr/all_applicants`);

        const interviews = Array.isArray(interviewsRaw)
          ? interviewsRaw
          : interviewsRaw?.data || [];

        const offers = Array.isArray(offersRaw)
          ? offersRaw
          : offersRaw?.data || [];

        const applications = Array.isArray(applicationsRaw)
          ? applicationsRaw
          : applicationsRaw?.data || [];

        // Filter applicants for this job
        const jobApplicants = applications.filter(
          (a) => String(a.job_id) === String(selectedJob.id)
        );

        const totalApplicants = jobApplicants.length;

        // Count screening/review
        const inReview = jobApplicants.filter(
          (a) => a.status?.toUpperCase() === "SCREENING"
        ).length;

        const totalInterviews = interviews.filter(
          (i) => String(i.job_id) === String(selectedJob.id)
        ).length;

        const totalOffers = offers.filter(
          (o) => String(o.job_id) === String(selectedJob.id)
        ).length;

        setStats({
          applicants: totalApplicants,
          review: inReview,
          interviews: totalInterviews,
          offers: totalOffers,
        });
      } catch (err) {
        console.error("Pipeline fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelineData();
  }, [selectedJob]);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-6 text-gray-500">
          Loading pipeline...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.applicants}
            </div>
            <div className="text-sm text-gray-600">
              Total Applicants
            </div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.review}
            </div>
            <div className="text-sm text-gray-600">
              In Review
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.interviews}
            </div>
            <div className="text-sm text-gray-600">
              Interviews
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.offers}
            </div>
            <div className="text-sm text-gray-600">
              Offers
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineModal;