import React, { useState } from 'react';
import { User, Briefcase, DollarSign, Settings, Edit2, Trash2, Loader } from 'lucide-react';
import SidePanel from '@/app/features/Employees/SidePanel';
import { generateAvatar } from '@/app/utils/formatters';
import EmployeeAvatar from '@/app/features/Employees/EmployeeAvatar';
import PersonalInfoForm from "@/app/features/Employees/PersonalInfo";
import JobInfoForm from '@/app/features/Employees/JobInfo';
import PayrollForm from '@/app/features/Employees/PayrollForm';
import { validateField, validateForm } from '@/app/utils/validation';
import { formatDate } from '@/app/utils/formatters';
import Button from '@/app/features/Employees/Button';

const EmployeeManagement = ({ isOpen, onClose, formData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);

  React.useEffect(() => {
    if (isOpen && formData) {
      setIsLoading(true);
      setTimeout(() => {
        const processedData = { ...formData };

        if (formData.name && !formData.firstName && !formData.lastName) {
          const nameParts = formData.name.split(' ');
          processedData.firstName = nameParts[0] || '';
          processedData.lastName = nameParts.slice(1).join(' ') || '';
        }

        const firstName = processedData.firstName || '';
        const lastName = processedData.lastName || '';
        processedData.avatar = generateAvatar(firstName, lastName);
        
        setEmployeeData({
          ...processedData,
          id: processedData.id || Math.random().toString(12).substr(2, 9),
          createdAt: processedData.createdAt || new Date().toISOString(),
          status: processedData.status?.toLowerCase() || 'active',
          salary: processedData.salary || '',
          bankAccount: processedData.bankAccount || '',
          taxNumber: processedData.taxNumber || ''
        });
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen, formData]);

  const handleValidateField = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleClose = () => {
    setIsLoading(true);
    setActiveTab('personal');
    setIsEditing(false);
    setEmployeeData(null);
    setErrors({});
    setSaveStatus(null);
    onClose();
  };

  const handleSave = () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'jobTitle', 'department'];
    const validationErrors = validateForm(employeeData, fieldsToValidate);

    if (Object.keys(validationErrors).length === 0) {
      setIsEditing(false);
      setSaveStatus('success');
      console.log('Saving employee data:', employeeData);
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setErrors(validationErrors);
      setSaveStatus('error');
    }
  };

  const handleDataChange = (field, value) => {
    setEmployeeData(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'firstName' || field === 'lastName') {
        const firstName = field === 'firstName' ? value : prev.firstName;
        const lastName = field === 'lastName' ? value : prev.lastName;
        updated.avatar = generateAvatar(firstName, lastName);
      }
      
      return updated;
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee account? This action cannot be undone.')) {
      console.log('Deleting employee:', employeeData.id);
      handleClose();
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'job', label: 'Job Information', icon: Briefcase },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  if (!isOpen) return null;

  return (
    <SidePanel isOpen={isOpen} onClose={handleClose} title="Employee Management">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4 text-green-700" size={32} />
            <p className="text-gray-600">Processing employee information...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <EmployeeAvatar src={employeeData?.avatar} name={`${employeeData?.firstName} ${employeeData?.lastName}`} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {employeeData?.firstName} {employeeData?.lastName}
                </h3>
                <p className="text-sm text-gray-600">{employeeData?.jobTitle}</p>
                <p className="text-xs text-gray-500">{employeeData?.department}</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex space-x-0">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const hasErrors = Object.keys(errors).some(key => {
                  if (tab.id === 'personal') return ['firstName', 'lastName', 'email', 'phone'].includes(key);
                  if (tab.id === 'job') return ['jobTitle', 'department', 'startDate'].includes(key);
                  if (tab.id === 'payroll') return ['salary', 'bankAccount', 'taxNumber'].includes(key);
                  return false;
                });

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                      activeTab === tab.id
                        ? 'border-green-700 text-green-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden lg:inline">{tab.label}</span>
                    {hasErrors && (
                      <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
                  </button>
                </div>
                <PersonalInfoForm
                  data={employeeData}
                  errors={errors}
                  isEditing={isEditing}
                  onChange={handleDataChange}
                  onValidate={handleValidateField}
                />
              </div>
            )}

            {activeTab === 'job' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Job Information</h4>
                  <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
                  </button>
                </div>
                <JobInfoForm
                  data={employeeData}
                  errors={errors}
                  isEditing={isEditing}
                  onChange={handleDataChange}
                  onValidate={handleValidateField}
                />
              </div>
            )}

            {activeTab === 'payroll' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Payroll Information</h4>
                  <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
                  </button>
                </div>
                <PayrollForm
                  data={employeeData}
                  errors={errors}
                  isEditing={isEditing}
                  onChange={handleDataChange}
                  onValidate={handleValidateField}
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h4 className="font-medium text-gray-900">Account Settings</h4>
                
                <div className="space-y-6">
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h5 className="font-medium text-blue-900 mb-2">Account Information</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Employee ID:</span>
                        <span className="text-blue-900 font-mono">{employeeData?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Created:</span>
                        <span className="text-blue-900">{formatDate(employeeData?.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Last Modified:</span>
                        <span className="text-blue-900">Today</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h5 className="font-medium text-red-900 mb-2">Danger Zone</h5>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete this employee account, all associated data will be permanently removed. This action cannot be undone.
                    </p>
                    <Button variant="danger" icon={Trash2} onClick={handleDelete}>
                      Delete Employee Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </SidePanel>
  );
};

export default EmployeeManagement;