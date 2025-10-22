import React, { useState } from 'react';
import { User, Mail, Briefcase } from 'lucide-react';
import SidePanel from '../../features/Employees/SidePanel';
import FormField from '../../features/Employees/FormField';
import Input from '../../features/Employees/Input';
import Select from '../../features/Employees/Select';
import Button from '../../features/Employees/Button';
import EmployeeManagement from './EmployeeManagement';
import { JOB_TITLES, DEPARTMENTS, EMPLOYEE_STATUSES } from '@/app/constants/employees/employeeConstants';

const NewEmployee = ({ isOpen, onClose }) => {
  const [showManagement, setShowManagement] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    startDate: '',
    status: 'active'
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.jobTitle || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmittedData(formData);
    setShowManagement(true);
  };

  const handleCloseManagement = () => {
    setShowManagement(false);
    setSubmittedData(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      startDate: '',
      status: 'active'
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      startDate: '',
      status: 'active'
    });
    onClose();
  };

  return (
    <>
      <SidePanel isOpen={isOpen} onClose={handleClose} title="Add New Employee" width="w-1/2">
        <div className="flex-1 overflow-y-auto p-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <User className="mr-2" size={16} />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="First Name" required>
                  <Input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                    placeholder="John"
                  />
                </FormField>
                <FormField label="Last Name" required>
                  <Input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                </FormField>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <Mail className="mr-2" size={16} />
              Contact Information
            </h3>
            <div className="space-y-4">
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="john.doe@company.com"
                />
              </FormField>
              <FormField label="Phone Number">
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="+27 123-4567"
                />
              </FormField>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <Briefcase className="mr-2" size={16} />
              Job Information
            </h3>
            <div className="space-y-4">
              <FormField label="Job Title" required>
                <Select
                  required
                  value={formData.jobTitle}
                  onChange={(e) => handleFormChange('jobTitle', e.target.value)}
                >
                  <option value="">Select Job Title</option>
                  {JOB_TITLES.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Department" required>
                <Select
                  required
                  value={formData.department}
                  onChange={(e) => handleFormChange('department', e.target.value)}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Start Date" required>
                <Input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => handleFormChange('startDate', e.target.value)}
                />
              </FormField>
              <FormField label="Status">
                <Select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  {EMPLOYEE_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </Select>
              </FormField>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} className="flex-1">
              Add Employee
            </Button>
          </div>
        </div>
      </SidePanel>

      <EmployeeManagement
        isOpen={showManagement}
        onClose={handleCloseManagement}
        formData={submittedData}
      />
    </>
  );
};

export default NewEmployee;