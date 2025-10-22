const validateField = (field, value) => {
  switch (field) {
    case 'firstName':
    case 'lastName':
      if (!value || value.trim().length < 2) {
        return 'Must be at least 2 characters long';
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
      break;
    case 'phone':
      if (value && !/^\+?[\d\s-()]+$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      break;
    case 'salary':
      if (value && (isNaN(value) || parseFloat(value) <= 0)) {
        return 'Salary must be a positive number';
      }
      break;
    case 'jobTitle':
    case 'department':
      if (!value) {
        return 'This field is required';
      }
      break;
    default:
      break;
  }
  return null;
};

const validateForm = (data, requiredFields) => {
  const errors = {};
  requiredFields.forEach(field => {
    const error = validateField(field, data[field]);
    if (error) errors[field] = error;
  });
  return errors;
};

export { validateField, validateForm };