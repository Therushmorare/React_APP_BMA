import React from 'react';
import FormField from './FormField';
import Input from './Input';
import Select from './Select';
import StatusBadge from './StatusBadge';
import { JOB_TITLES, DEPARTMENTS, EMPLOYEE_STATUSES } from '@/app/constants/employees/employeeConstants';
import { formatDate } from '@/app/utils/formatters';

const JobInfoForm = ({ data, errors, isEditing, onChange, onValidate }) => (
  <div className="space-y-4">
    <FormField label="Job Title" required error={errors.jobTitle}>
      {isEditing ? (
        <Select
          value={data.jobTitle || ''}
          onChange={(e) => onChange('jobTitle', e.target.value)}
          onBlur={(e) => onValidate('jobTitle', e.target.value)}
          error={errors.jobTitle}
        >
          <option value="">Select Job Title</option>
          {JOB_TITLES.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </Select>
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{data.jobTitle}</p>
      )}
    </FormField>

    <FormField label="Department" required error={errors.department}>
      {isEditing ? (
        <Select
          value={data.department || ''}
          onChange={(e) => onChange('department', e.target.value)}
          onBlur={(e) => onValidate('department', e.target.value)}
          error={errors.department}
        >
          <option value="">Select Department</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </Select>
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{data.department}</p>
      )}
    </FormField>

    <FormField label="Start Date">
      {isEditing ? (
        <Input
          type="date"
          value={data.startDate || ''}
          onChange={(e) => onChange('startDate', e.target.value)}
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formatDate(data.startDate)}</p>
      )}
    </FormField>

    <FormField label="Status">
      {isEditing ? (
        <Select
          value={data.status || ''}
          onChange={(e) => onChange('status', e.target.value)}
        >
          {EMPLOYEE_STATUSES.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </Select>
      ) : (
        <StatusBadge status={data.status} />
      )}
    </FormField>
  </div>
);

export default JobInfoForm;