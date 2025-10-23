"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MFAPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null); // store user_id safely

  // ✅ Load sessionStorage only in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("user_id");
      if (!storedUserId) {
        router.push("/login");
      } else {
        setUserId(storedUserId);
      }
    }
  }, [router]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/hr/hrAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id: userId, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      sessionStorage.setItem("employee_email", data.email);
      router.push("/applications");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null; // wait until useEffect sets it

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          MFA Verification
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-gray-700 font-medium">
            Enter MFA Code
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}