import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase } from 'lucide-react';
import SidePanel from '../../features/Employees/SidePanel';
import FormField from '../../features/Employees/FormField';
import Input from '../../features/Employees/Input';
import Select from '../../features/Employees/Select';
import Button from '../../features/Employees/Button';
import EmployeeManagement from './EmployeeManagement';
import { JOB_TITLES, DEPARTMENTS, EMPLOYEE_STATUSES } from '@/app/constants/employees/employeeConstants';

const NewEmployee = ({ isOpen, onClose, creatorEmployeeId }) => {
  // ====== Employee ID ======
  const [employeeId, setEmployeeId] = useState("");
  
  useEffect(() => {
    // Only runs on client
    const id = sessionStorage.getItem("user_id");
    if (id) setEmployeeId(id);
  }, []);
  
  const [showManagement, setShowManagement] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    startDate: '',
    status: 'ACTIVE',
    IDNumber: '',
    dateOfBirth: '',
    nationality: '',
    physicalAddress: '',
    city: '',
    province: '',
    postalCode: '',
    employmentType: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialState);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.jobTitle || !formData.department) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        creator_employee_id: creatorEmployeeId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        job_title: formData.jobTitle,
        department: formData.department,
        start_date: formData.startDate,
        status: formData.status,
        ID_number: formData.IDNumber,
        date_of_birth: formData.dateOfBirth,
        nationality: formData.nationality,
        physical_address: formData.physicalAddress,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode,
        employment_type: formData.employmentType,
        description: formData.description
      };

      const response = await fetch('https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/addNewEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // add Authorization header here if you use JWT
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create employee");
      }

      setSubmittedData(data);
      setShowManagement(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  const handleCloseManagement = () => {
    setShowManagement(false);
    setSubmittedData(null);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <SidePanel isOpen={isOpen} onClose={handleClose} title="Add New Employee" width="w-1/2">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <User className="mr-2" size={16} />
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" required>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleFormChange('firstName', e.target.value)}
                />
              </FormField>

              <FormField label="Last Name" required>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleFormChange('lastName', e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="ID Number">
              <Input
                value={formData.IDNumber}
                onChange={(e) => handleFormChange('IDNumber', e.target.value)}
              />
            </FormField>

            <FormField label="Date of Birth">
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
              />
            </FormField>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <Mail className="mr-2" size={16} />
              Contact Information
            </h3>

            <FormField label="Email" required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
              />
            </FormField>

            <FormField label="Phone">
              <Input
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
              />
            </FormField>

            <FormField label="Physical Address">
              <Input
                value={formData.physicalAddress}
                onChange={(e) => handleFormChange('physicalAddress', e.target.value)}
              />
            </FormField>
          </div>

          {/* Job Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <Briefcase className="mr-2" size={16} />
              Job Information
            </h3>

            <FormField label="Job Title" required>
              <Select
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
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Employment Type">
              <Input
                value={formData.employmentType}
                onChange={(e) => handleFormChange('employmentType', e.target.value)}
              />
            </FormField>

            <FormField label="Description">
              <Input
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
              />
            </FormField>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Employee"}
          </Button>
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