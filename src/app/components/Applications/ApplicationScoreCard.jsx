"use client";

import React from "react";

const ScoreCard = ({ label, value, max = 10 }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <p className="text-gray-600 font-medium mb-2">{label}</p>
      <div className="w-full bg-gray-200 h-3 rounded-full">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-gray-900 font-semibold mt-1">{value} / {max}</p>
    </div>
  );
};

export default ScoreCard;
