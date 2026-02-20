"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Filter,
  Search,
  Loader,
  FolderOpen,
  Calendar,
  User,
  AlertCircle,
  X,
} from "lucide-react";

const API_BASE_URL =
  "https://jellyfish-app-z83s2.ondigitalocean.app";

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <Loader className="animate-spin mx-auto mb-4 text-green-700" size={32} />
      <p className="text-gray-600">Loading documents...</p>
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex justify-center items-center h-64">
    <div className="text-center">
      <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
      <p className="text-gray-900 font-medium mb-2">Error Loading Documents</p>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const DocumentRow = React.memo(({ doc, onView, onDownload }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <FileText className="text-green-700" size={20} />
          <span
            className="text-sm font-medium text-gray-900 truncate max-w-xs"
            title={doc.name}
          >
            {doc.name}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {doc.category}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">—</td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <User size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600 truncate max-w-xs">
            {doc.uploaded_by}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">—</td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onView(doc.id)}
            className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
            title="View document"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onDownload(doc.id)}
            className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
            title="Download document"
          >
            <Download size={18} />
          </button>

          {/* Delete disabled (no backend support) */}
          <button
            disabled
            className="p-2 text-gray-300 cursor-not-allowed"
            title="Delete not supported"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
});

DocumentRow.displayName = "DocumentRow";

const DocumentsModal = ({ onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch documents from API
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/allDocuments`,
        {
          method: "GET",
          headers: { accept: "application/json" },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setDocuments([]);
          return;
        }
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();

      const transformed = data.map((doc) => {
        const fileName = doc.document.split("/").pop();

        return {
          id: doc.qualification_id,
          name: fileName,
          category: doc.type,
          uploaded_by: doc.applicant_id,
          url: doc.document,
        };
      });

      setDocuments(transformed);

      const uniqueCategories = [
        "all",
        ...new Set(transformed.map((d) => d.category)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filtering + Searching
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterType === "all" || doc.category === filterType;

      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, filterType]);

  // Pagination
  const paginatedDocuments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, page]);

  const totalPages = Math.ceil(filteredDocuments.length / pageSize);

  const handleView = (id) => {
    const doc = documents.find((d) => d.id === id);
    if (doc?.url) window.open(doc.url, "_blank");
  };

  const handleDownload = (id) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc?.url) return;

    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      <div className="absolute inset-4 md:inset-8 bg-white rounded-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-bold">Documents</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Search + Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchDocuments} />
          ) : (
            <>
              {/* Stats */}
              <div className="mb-4 text-sm text-gray-600">
                Total Documents: {filteredDocuments.length}
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Size
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Uploaded By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {paginatedDocuments.length > 0 ? (
                      paginatedDocuments.map((doc) => (
                        <DocumentRow
                          key={doc.id}
                          doc={doc}
                          onView={handleView}
                          onDownload={handleDownload}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-gray-500">
                          No documents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;