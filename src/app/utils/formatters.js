const formatSalary = (salary) => {
  if (!salary) return 'Not configured';
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(salary);
};

const formatDate = (date) => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString();
};

const generateAvatar = (firstName, lastName) => {
  const name = `${firstName || 'N'} ${lastName || 'A'}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=ffffff&size=128`;
};

const maskBankAccount = (account) => {
  if (!account) return 'Not configured';
  return `****${account.slice(-4)}`;
};

export { formatSalary, formatDate, generateAvatar, maskBankAccount };