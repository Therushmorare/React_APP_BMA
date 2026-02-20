import React, { useState, useEffect } from 'react';
import { User, Briefcase, Settings, Edit2, Trash2, Loader } from 'lucide-react';
import SidePanel from '@/app/features/Employees/SidePanel';
import { generateAvatar, formatDate } from '@/app/utils/formatters';
import EmployeeAvatar from '@/app/features/Employees/EmployeeAvatar';
import PersonalInfoForm from "@/app/features/Employees/PersonalInfo";
import JobInfoForm from '@/app/features/Employees/JobInfo';
import { validateField, validateForm } from '@/app/utils/validation';
import Button from '@/app/features/Employees/Button';

const EmployeeManagement = ({ isOpen, onClose, formData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (isOpen && formData) {
      setIsLoading(true);

      const processedData = { ...formData };

      if (formData.name && !formData.firstName && !formData.lastName) {
        const nameParts = formData.name.split(' ');
        processedData.firstName = nameParts[0] || '';
        processedData.lastName = nameParts.slice(1).join(' ') || '';
      }

      const firstName = processedData.firstName || '';
      const lastName = processedData.lastName || '';

      setEmployeeData({
        ...processedData,
        avatar: generateAvatar(firstName, lastName),
        id: processedData.id || Math.random().toString(12).substr(2, 9),
        createdAt: processedData.createdAt || new Date().toISOString(),
        status: processedData.status || 'ACTIVE'
      });

      setIsLoading(false);
    }
  }, [isOpen, formData]);

  const handleValidateField = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => {
      const updated = { ...prev };
      if (error) updated[field] = error;
      else delete updated[field];
      return updated;
    });
  };

  const handleClose = () => {
    setActiveTab('personal');
    setIsEditing(false);
    setEmployeeData(null);
    setErrors({});
    setSaveStatus(null);
    onClose();
  };

  const handleSave = async () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'jobTitle', 'department'];
    const validationErrors = validateForm(employeeData, fieldsToValidate);

    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      setSaveStatus('error');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus(null);

      const token = sessionStorage.getItem("access_token");
      const creatorId = sessionStorage.getItem("user_id");

      if (!token) throw new Error("Authentication required.");

      const payload = {
        creator_employee_id: creatorId,
        first_name: employeeData.firstName || "",
        last_name: employeeData.lastName || "",
        email: employeeData.email || "",
        phone_number: employeeData.phone || "",
        job_title: employeeData.jobTitle || "",
        department: employeeData.department || "",
        status: (employeeData.status || "ACTIVE").toUpperCase(),
        ID_number: employeeData.ID_number || "",
        date_of_birth: employeeData.dateOfBirth || "",
        nationality: employeeData.nationality || "",
        physical_address: employeeData.physicalAddress || "",
        city: employeeData.city || "",
        province: employeeData.province || "",
        postal_code: employeeData.postalCode || "",
        employment_type: employeeData.employmentType || "",
        description: employeeData.description || ""
      };

      const response = await fetch(
        `https://jellyfish-app-z83s2.ondigitalocean.app/api/hr/updateEmployee/${employeeData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Update failed");
      }

      setIsEditing(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);

    } catch (error) {
      console.error("Update error:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataChange = (field, value) => {
    setEmployeeData(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'firstName' || field === 'lastName') {
        updated.avatar = generateAvatar(
          field === 'firstName' ? value : prev.firstName,
          field === 'lastName' ? value : prev.lastName
        );
      }

      return updated;
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee account?')) {
      handleClose();
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'job', label: 'Job Information', icon: Briefcase },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  if (!isOpen) return null;

  return (
    <SidePanel isOpen={isOpen} onClose={handleClose} title="Employee Management">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin text-green-700" size={32} />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <EmployeeAvatar
                src={employeeData?.avatar}
                name={`${employeeData?.firstName} ${employeeData?.lastName}`}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {employeeData?.firstName} {employeeData?.lastName}
                </h3>
                <p className="text-sm text-gray-600">{employeeData?.jobTitle}</p>
                <p className="text-xs text-gray-500">{employeeData?.department}</p>
              </div>
            </div>
          </div>

          {/* Save Feedback */}
          {saveStatus === "success" && (
            <div className="mx-6 mt-4 p-3 bg-green-100 text-green-800 rounded text-sm">
              Employee updated successfully.
            </div>
          )}
          {saveStatus === "error" && (
            <div className="mx-6 mt-4 p-3 bg-red-100 text-red-800 rounded text-sm">
              Failed to update employee.
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 flex">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const hasErrors = Object.keys(errors).some(key => {
                if (tab.id === 'personal') return ['firstName','lastName','email','phone'].includes(key);
                if (tab.id === 'job') return ['jobTitle','department'].includes(key);
                return false;
              });

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 relative ${
                    activeTab === tab.id
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {hasErrors && (
                    <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {(activeTab === 'personal' || activeTab === 'job') && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    {activeTab === 'personal' ? 'Personal Information' : 'Job Information'}
                  </h4>
                  <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    disabled={isSaving}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader size={14} className="animate-spin" />
                    ) : (
                      <Edit2 size={14} />
                    )}
                    <span>
                      {isEditing ? (isSaving ? "Saving..." : "Save") : "Edit"}
                    </span>
                  </button>
                </div>

                {activeTab === 'personal' ? (
                  <PersonalInfoForm
                    data={employeeData}
                    errors={errors}
                    isEditing={isEditing}
                    onChange={handleDataChange}
                    onValidate={handleValidateField}
                  />
                ) : (
                  <JobInfoForm
                    data={employeeData}
                    errors={errors}
                    isEditing={isEditing}
                    onChange={handleDataChange}
                    onValidate={handleValidateField}
                  />
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="p-4 border rounded bg-blue-50">
                  <div className="flex justify-between text-sm">
                    <span>Employee ID:</span>
                    <span className="font-mono">{employeeData?.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Created:</span>
                    <span>{formatDate(employeeData?.createdAt)}</span>
                  </div>
                </div>

                <div className="p-4 border rounded bg-red-50">
                  <Button variant="danger" icon={Trash2} onClick={handleDelete}>
                    Delete Employee Account
                  </Button>
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