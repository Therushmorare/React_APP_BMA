import React from 'react';
import FormField from './FormField';
import Input from './Input';
import { formatSalary, maskBankAccount } from '@/app/utils/formatters';

const PayrollForm = ({ data, errors, isEditing, onChange, onValidate }) => (
  <div className="space-y-4">
    <FormField label="Monthly Salary (ZAR)" error={errors.salary}>
      {isEditing ? (
        <Input
          type="number"
          value={data.salary || ''}
          onChange={(e) => onChange('salary', e.target.value)}
          onBlur={(e) => onValidate('salary', e.target.value)}
          placeholder="25000"
          min="0"
          step="100"
          error={errors.salary}
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formatSalary(data.salary)}</p>
      )}
    </FormField>

    <FormField label="Bank Account Number">
      {isEditing ? (
        <Input
          type="text"
          value={data.bankAccount || ''}
          onChange={(e) => onChange('bankAccount', e.target.value)}
          placeholder="1234567890"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{maskBankAccount(data.bankAccount)}</p>
      )}
    </FormField>

    <FormField label="Tax Number">
      {isEditing ? (
        <Input
          type="text"
          value={data.taxNumber || ''}
          onChange={(e) => onChange('taxNumber', e.target.value)}
          placeholder="9876543210123"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{data.taxNumber || 'Not configured'}</p>
      )}
    </FormField>
  </div>
);

export default PayrollForm;