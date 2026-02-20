"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Download, Eye, Trash2, Filter, Search, Loader, FolderOpen, Calendar, User, AlertCircle, X } from 'lucide-react';

const API_BASE_URL = "https://jellyfish-app-z83s2.ondigitalocean.app";

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

const DocumentsModal = ({ onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/allDocuments`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();

      // Transform API response to match your UI
      const formatted = data.map((doc, index) => ({
        id: doc.qualification_id,
        name: doc.document.split('/').pop(),
        category: doc.type,
        size: "—",
        uploaded_by: doc.applicant_id,
        uploaded_date: "—",
        url: doc.document
      }));

      setDocuments(formatted);
      setFilteredDocs(formatted);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Search + Filter Logic
  useEffect(() => {
    let result = [...documents];

    if (filterType !== 'all') {
      result = result.filter(doc => doc.category === filterType);
    }

    if (searchQuery) {
      result = result.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDocs(result);
  }, [searchQuery, filterType, documents]);

  const categories = ['all', ...new Set(documents.map(doc => doc.category))];

  const stats = {
    total_documents: filteredDocs.length,
    total_categories: categories.length - 1,
    total_size: "—"
  };

  const handleView = (doc) => {
    window.open(doc.url, '_blank');
  };

  const handleDownload = async (doc) => {
    const response = await fetch(doc.url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async () => {
    alert("Delete endpoint not provided.");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-white bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-4 md:inset-8 bg-white rounded-lg shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and view all your documents</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* Search & Filter */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchDocuments} />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-green-700">
                  <p className="text-gray-600 text-sm">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_documents}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-blue-500">
                  <p className="text-gray-600 text-sm">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_categories}</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 border-l-4 border-l-purple-500">
                  <p className="text-gray-600 text-sm">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_size}</p>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Document Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Size</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Uploaded By</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.uploaded_by}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => handleView(doc)} className="p-2 hover:text-green-700">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => handleDownload(doc)} className="p-2 hover:text-blue-700">
                            <Download size={18} />
                          </button>
                          <button onClick={() => handleDelete(doc)} className="p-2 hover:text-red-700">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;