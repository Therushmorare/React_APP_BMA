import React from 'react';
import { Users, TrendingUp, Target, Award, Clock } from 'lucide-react';

const KPICards = ({ kpiData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{kpiData.totalApplications}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Users className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">App to Interview Rate</p>
            <p className="text-2xl font-bold text-gray-900">{kpiData.applicationToInterview}%</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Interview to Offer Rate</p>
            <p className="text-2xl font-bold text-gray-900">{kpiData.interviewToOffer}%</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Offer Acceptance Rate</p>
            <p className="text-2xl font-bold text-gray-900">{kpiData.offerAcceptance}%</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Award className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Time to Hire</p>
            <p className="text-2xl font-bold text-gray-900">{kpiData.averageTimeToHire} days</p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <Clock className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICards;