"use client";

import { useState } from "react";
import { Star } from "lucide-react"; // Make sure lucide-react is installed

export default function ApplicationEvaluationCard({ employeeId, candidateId, jobId }) {
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // for hover effect
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!candidateId || !jobId || !employeeId) return;

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/candidateEvaluation/${employeeId}/${candidateId}/${jobId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_id: employeeId,
            candidate_id: candidateId,
            job_id: jobId,
            notes,
            rating,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit evaluation");

      setSuccess(true);
      setNotes("");
      setRating(0);
      setHoverRating(0);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error submitting evaluation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="block text-gray-700 font-medium mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-200 focus:border-green-600"
          rows={4}
          placeholder="Enter your evaluation notes here..."
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={`cursor-pointer ${
                (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Evaluation"}
        </button>
      </div>

      {success && <p className="text-green-600 font-medium">Evaluation submitted successfully!</p>}
      {error && <p className="text-red-600 font-medium">{error}</p>}
    </div>
  );
}