import React from 'react';
import FormField from './FormField';
import Input from './Input';

const PersonalInfoForm = ({ data, errors, isEditing, onChange, onValidate }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <FormField label="First Name" required error={errors.firstName}>
        {isEditing ? (
          <Input
            type="text"
            value={data.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            onBlur={(e) => onValidate('firstName', e.target.value)}
            error={errors.firstName}
          />
        ) : (
          <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{data.firstName}</p>
        )}
      </FormField>

      <FormField label="Last Name" required error={errors.lastName}>
        {isEditing ? (
          <Input
            type="text"
            value={data.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            onBlur={(e) => onValidate('lastName', e.target.value)}
            error={errors.lastName}
          />
        ) : (
          <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{data.lastName}</p>
        )}
      </FormField>

      <div className="col-span-2">
        <FormField label="Email Address" required error={errors.email}>
          {isEditing ? (
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              onBlur={(e) => onValidate('email', e.target.value)}
              error={errors.email}
            />
          ) : (
            <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{data.email}</p>
          )}
        </FormField>
      </div>

      <div className="col-span-2">
        <FormField label="Phone Number" error={errors.phone}>
          {isEditing ? (
            <Input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
              onBlur={(e) => onValidate('phone', e.target.value)}
              placeholder="+27 11 123 4567"
              error={errors.phone}
            />
          ) : (
            <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{data.phone || 'Not provided'}</p>
          )}
        </FormField>
      </div>
    </div>
  </div>
);

export default PersonalInfoForm;