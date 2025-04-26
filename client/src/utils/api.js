const API_URL = import.meta.env.VITE_API_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Add authentication headers
const getHeaders = (userId) => ({
  'Content-Type': 'application/json',
  'user-id': userId,
});

// Generic API call function with authentication
const apiCall = async (endpoint, options = {}) => {
  // Get user ID from Clerk
    const clerk = window.Clerk;
    await clerk?.load();
    const userId = clerk?.user?.id;
    
    if (!userId) {
      throw new Error('Authentication required');
    }
  
    console.log('Making API call with user ID:', userId);

  const headers = {
    ...getHeaders(userId),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

// Tasks API
export const tasksApi = {
  getAll: () => apiCall('/api/tasks'),
  
  create: (task) => apiCall('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  
  update: (id, updates) => apiCall(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  
  delete: (id) => apiCall(`/api/tasks/${id}`, {
    method: 'DELETE',
  }),
};

// Transactions API
export const transactionsApi = {
  getAll: () => apiCall('/api/transactions'),
  
  create: (transaction) => apiCall('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  }),
  
  update: (id, updates) => apiCall(`/api/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  
  delete: (id) => apiCall(`/api/transactions/${id}`, {
    method: 'DELETE',
  }),
};

// User settings API
export const userSettingsApi = {
  get: () => apiCall('/api/user-settings'),
  
  update: (settings) => apiCall('/api/user-settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
};

export default {
  tasks: tasksApi,
  transactions: transactionsApi,
  userSettings: userSettingsApi,
};