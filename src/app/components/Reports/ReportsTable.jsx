import React from 'react';

const PerformanceTable = ({ performanceData, getPerformanceColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Position Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Position</th>
              <th className="text-left p-4 font-semibold text-gray-700">Applicants</th>
              <th className="text-left p-4 font-semibold text-gray-700">Interviews</th>
              <th className="text-left p-4 font-semibold text-gray-700">Offers</th>
              <th className="text-left p-4 font-semibold text-gray-700">Hires</th>
              <th className="text-left p-4 font-semibold text-gray-700">Conversion Rate</th>
              <th className="text-left p-4 font-semibold text-gray-700">Avg Time to Hire</th>
              <th className="text-left p-4 font-semibold text-gray-700">Performance</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="font-medium text-gray-900">{row.position}</span>
                </td>
                <td className="p-4 text-gray-700">{row.applicants}</td>
                <td className="p-4 text-gray-700">{row.interviews}</td>
                <td className="p-4 text-gray-700">{row.offers}</td>
                <td className="p-4 text-gray-700">{row.hires}</td>
                <td className="p-4 text-gray-700">{row.conversionRate}%</td>
                <td className="p-4 text-gray-700">{row.avgTimeToHire} days</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(row.performance)}`}>
                    {row.performance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTable;