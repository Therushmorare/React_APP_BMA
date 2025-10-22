"use client";

import { useEffect, useState, useCallback } from "react";
import ApplicationsTable from "/components/Applications/ApplicationsTable";
import { fetchAllApplicants } from "/services/api";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "applicationId", direction: "asc" });
  const [actionLoading, setActionLoading] = useState({});

  // Fetch data on mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchAllApplicants();

        // Transform data from backend to match your table fields
        const formatted = data.map((item) => ({
          id: item.applicant_id,
          applicationId: item.application_code,
          candidateName: `${item.first_name} ${item.last_name}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.first_name + " " + item.last_name)}&background=22c55e&color=ffffff&size=128`,
          email: item.email,
          phone: item.phone_number,
          status: item.application_status,
        }));

        setApplications(formatted);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching applications");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  // Sorting logic
  const onSort = useCallback((key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });

    setApplications((prev) =>
      [...prev].sort((a, b) => {
        const aVal = a[key]?.toString().toLowerCase() || "";
        const bVal = b[key]?.toString().toLowerCase() || "";
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  }, [sortConfig]);

  // Delete action placeholder
  const onApplicationAction = (id, action) => {
    if (action === "delete") {
      console.log(`Deleting application ${id}`);
      // TODO: implement delete API call
    }
  };

  const onViewApplication = (application) => {
    console.log("Viewing:", application);
    // TODO: implement modal or redirect to details page
  };

  const onClearFilters = () => {
    // TODO: reset filters when you add them
    console.log("Filters cleared");
  };

  if (loading) return <p className="text-center py-10">Loading applications...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Applications</h1>
      <ApplicationsTable
        applications={applications}
        sortConfig={sortConfig}
        onSort={onSort}
        onApplicationAction={onApplicationAction}
        onViewApplication={onViewApplication}
        actionLoading={actionLoading}
        onClearFilters={onClearFilters}
      />
    </div>
  );
}