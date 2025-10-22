"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Download, Loader, AlertCircle } from "lucide-react";
import _ from "lodash";
import ApplicationsFilter from "./ApplicationsFilter";
import ApplicationsTable from "./ApplicationsTable";
import ApplicationsPagination from "./ApplicationsPagination";
import ApplicationModal from "./ApplicationsModal";
import { fetchAllApplicants } from "../../services/api";

const APPLICATIONS_PER_PAGE = 30;

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    position: "",
    status: "",
    type: "",
    experience: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "applicationId", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch real data from API
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchAllApplicants();
        console.log("Fetched data:", data); // 👀 Check what’s coming from API

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format from API");
        }

        const formatted = data.map((item) => ({
          id: item.applicant_id ?? "",
          applicationId: item.application_code ?? "",
          candidateName: `${item.first_name ?? ""} ${item.last_name ?? ""}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            (item.first_name ?? "") + " " + (item.last_name ?? "")
          )}&background=22c55e&color=ffffff&size=128`,
          email: item.email ?? "N/A",
          phone: item.phone_number ?? "N/A",
          status: item.application_status ?? "Pending",
        }));

        setApplications(formatted);
        setFilteredApplications(formatted);
      } catch (err) {
        console.error("Error loading applications:", err);
        setError(err.message || "Error fetching applications");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    _.debounce((query) => {
      const filtered = applications.filter(
        (a) =>
          a.candidateName.toLowerCase().includes(query.toLowerCase()) ||
          a.email.toLowerCase().includes(query.toLowerCase()) ||
          a.applicationId.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredApplications(filtered);
      setCurrentPage(1);
    }, 400),
    [applications]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Filter logic
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    let filtered = applications;
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k]) {
        filtered = filtered.filter((app) =>
          app[k]?.toLowerCase().includes(newFilters[k].toLowerCase())
        );
      }
    });
    setFilteredApplications(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      department: "",
      position: "",
      status: "",
      type: "",
      experience: "",
    });
    setSearchQuery("");
    setFilteredApplications(applications);
  };

  // Sorting
  const onSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    setFilteredApplications((prev) =>
      [...prev].sort((a, b) => {
        const aVal = a[key]?.toString().toLowerCase() || "";
        const bVal = b[key]?.toString().toLowerCase() || "";
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / APPLICATIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * APPLICATIONS_PER_PAGE;
  const currentApplications = filteredApplications.slice(startIndex, startIndex + APPLICATIONS_PER_PAGE);

  // Modal
  const onViewApplication = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-green-700" size={32} />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-10 flex justify-center items-center">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">All Applications</h1>
          <p className="text-gray-600 text-sm">
            {filteredApplications.length} total applications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-green-200 focus:border-green-600"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <ApplicationsFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <ApplicationsTable
        applications={currentApplications}
        sortConfig={sortConfig}
        onSort={onSort}
        onViewApplication={onViewApplication}
      />

      {/* Pagination */}
      <ApplicationsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {showModal && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}