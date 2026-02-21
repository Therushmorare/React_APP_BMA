import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";

const DeleteJobModal = ({
  selectedJob,
  isOpen,
  onClose,
  onDeleted, // callback to refresh list
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !selectedJob) return null;

  const handleDelete = async () => {
    const employeeId = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("access_token");
    const jobId = selectedJob.job_id || selectedJob.id;

    if (!employeeId || !jobId) {
      alert("Missing required IDs.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/deletePost/${employeeId}/${jobId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employee_id: employeeId,
            job_id: jobId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      // Success
      onClose();
      if (onDeleted) onDeleted(jobId);

    } catch (error) {
      console.error("Delete job error:", error);
      alert("Failed to delete job posting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Job Posting
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Job Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border">
          <p className="text-sm font-medium text-gray-900">
            {selectedJob.title || selectedJob.job_title}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedJob.department} • {selectedJob.location}
          </p>
        </div>

        {/* Warning */}
        <div className="flex items-start space-x-3 mb-6">
          <div className="bg-red-100 text-red-600 p-2 rounded-lg">
            <Trash2 size={18} />
          </div>
          <p className="text-sm text-gray-600">
            Deleting this job will permanently remove it from the system,
            including associated applications.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="text-sm">Deleting...</span>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteJobModal;