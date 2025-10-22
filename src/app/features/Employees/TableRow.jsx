import React from 'react';
import StatusBadge from './StatusBadge';
import EmployeeAvatar from '@/app/features/Employees/EmployeeAvatar';
import { formatDate } from '@/app/utils/formatters';

const EmployeeTableRow = React.memo(({ employee, onView, onEdit, onDelete }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <td className="p-3">
      <div className="flex items-center space-x-3">
        <EmployeeAvatar src={employee.avatar} name={employee.name} size="sm" />
        <div>
          <h4 className="font-semibold text-gray-900">{employee.name}</h4>
          <p className="text-xs text-gray-600">{employee.email}</p>
        </div>
      </div>
    </td>
    <td className="p-3">
      <p className="text-xs text-gray-700">{employee.phone}</p>
    </td>
    <td className="p-3">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {employee.jobTitle}
      </span>
    </td>
    <td className="p-3">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {employee.department}
      </span>
    </td>
    <td className="p-3">
      <p className="text-xs text-gray-700">{formatDate(employee.startDate)}</p>
    </td>
    <td className="p-3">
      <StatusBadge status={employee.status} />
    </td>
    <td className="p-3">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(employee)}
          className="p-1.5 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          title="View employee"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to remove this employee?')) {
              onDelete(employee.id);
            }
          }}
          className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          title="Remove employee"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
));

export default EmployeeTableRow;