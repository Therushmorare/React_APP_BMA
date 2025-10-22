"use client";

import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import EmployeeTableRow from '../../features/Employees/TableRow';
import SearchAndFilters from '../../features/Employees/SearchAndFilter';
import Pagination from '../../features/Employees/Pagination';
import NewEmployee from './NewEmployee';
import EmployeeManagement from './EmployeeManagement';
import Button from '../../features/Employees/Button';
import { generateMockEmployees } from '@/app/utils/mockData';
import { filterEmployees, paginateData } from '@/app/utils/dataProcessing';


const ITEMS_PER_PAGE = 20;

const EmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    jobTitle: '',
    status: '',
    account: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  const allEmployees = useMemo(() => generateMockEmployees(5000), []);

  const filteredEmployees = useMemo(() => {
    return filterEmployees(allEmployees, filters, searchQuery);
  }, [allEmployees, filters, searchQuery]);

  const paginatedEmployees = useMemo(() => {
    return paginateData(filteredEmployees, currentPage, ITEMS_PER_PAGE);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsManagementOpen(true);
  };

  const handleEditEmployee = (employee) => {
    console.log('Edit employee:', employee.id);
  };

  const handleDeleteEmployee = (id) => {
    console.log('Delete employee:', id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Employees</h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            Manage employees and their information across all departments. Currently showing {filteredEmployees.length} of {allEmployees.length} employees.
          </p>
        </div>
        <div className="ml-8">
          <Button variant="primary" icon={Plus} onClick={() => setIsFormOpen(true)}>
            Add New Employee
          </Button>
        </div>
      </div>

      <SearchAndFilters
        searchQuery={searchQuery}
        filters={filters}
        onSearchChange={setSearchQuery}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearFilters={() => {
          setFilters({ jobTitle: '', status: '', account: '' });
          setSearchQuery('');
          setCurrentPage(1);
        }}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">Employee</th>
                <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left p-4 font-semibold text-gray-700">Job Title</th>
                <th className="text-left p-4 font-semibold text-gray-700">Department</th>
                <th className="text-left p-4 font-semibold text-gray-700">Start Date</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <EmployeeTableRow
                  key={employee.id}
                  employee={employee}
                  onView={handleViewEmployee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredEmployees.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>

      <NewEmployee isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <EmployeeManagement
        isOpen={isManagementOpen}
        onClose={() => setIsManagementOpen(false)}
        formData={selectedEmployee}
      />
    </div>
  );
};

export default EmployeesPage;