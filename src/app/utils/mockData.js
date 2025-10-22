import { JOB_TITLES, DEPARTMENTS } from '@/app/constants/employees/employeeConstants';
import { generateAvatar } from './formatters';

export const generateMockEmployees = (count) => {
  const employees = [];
  const firstNames = ['Nombuso', 'Sipho', 'Aisha', 'Liam', 'Noah', 'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Zola', 'Thandi', 'Jabu', 'Sibusiso', 'Lerato', 'Kagiso'];
  const lastNames = ['Johnson', 'Chen', 'Rodriguez', 'Wilson', 'Thompson', 'Miller', 'Garcia', 'Martinez', 'Brown', 'Davis', 'Smith', 'Anderson', 'Taylor', 'Moore', 'Nguyen', 'Patel', 'Kumar', 'Singh', 'Naidoo', 'Mokoena', 'Dlamini', 'Mthethwa'];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const jobTitle = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const statuses = ['Active', 'Inactive', 'On Leave', 'Terminated', 'Pending Deactivation'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    employees.push({
      id: i,
      name,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      phone: `+27 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      jobTitle,
      department,
      startDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      status,
      avatar: generateAvatar(name)
    });
  }
  return employees;
};