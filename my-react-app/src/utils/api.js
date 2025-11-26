// API base URL - uses environment variable or falls back to localhost
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Users API
export const usersAPI = {
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
  login: (credentials) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  create: (userData) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiCall(`/users/${id}`, { method: 'DELETE' }),
};

// Employees API
export const employeesAPI = {
  getAll: () => apiCall('/employees'),
  getById: (id) => apiCall(`/employees/${id}`),
  create: (employeeData) => apiCall('/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  }),
  update: (id, employeeData) => apiCall(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  }),
  delete: (id) => apiCall(`/employees/${id}`, { method: 'DELETE' }),
};

// Attendance API
export const attendanceAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/attendance?${params}`);
  },
  getById: (id) => apiCall(`/attendance/${id}`),
  create: (attendanceData) => apiCall('/attendance', {
    method: 'POST',
    body: JSON.stringify(attendanceData),
  }),
  update: (id, attendanceData) => apiCall(`/attendance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(attendanceData),
  }),
  delete: (id) => apiCall(`/attendance/${id}`, { method: 'DELETE' }),
};

// Hazards API
export const hazardsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/hazards?${params}`);
  },
  getById: (id) => apiCall(`/hazards/${id}`),
  create: (hazardData) => apiCall('/hazards', {
    method: 'POST',
    body: JSON.stringify(hazardData),
  }),
  update: (id, hazardData) => apiCall(`/hazards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(hazardData),
  }),
  delete: (id) => apiCall(`/hazards/${id}`, { method: 'DELETE' }),
};

// Equipment API
export const equipmentAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/equipment?${params}`);
  },
  getById: (id) => apiCall(`/equipment/${id}`),
  create: (equipmentData) => apiCall('/equipment', {
    method: 'POST',
    body: JSON.stringify(equipmentData),
  }),
  update: (id, equipmentData) => apiCall(`/equipment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(equipmentData),
  }),
  delete: (id) => apiCall(`/equipment/${id}`, { method: 'DELETE' }),
};

// Notifications API
export const notificationsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/notifications?${params}`);
  },
  getById: (id) => apiCall(`/notifications/${id}`),
  create: (notificationData) => apiCall('/notifications', {
    method: 'POST',
    body: JSON.stringify(notificationData),
  }),
  update: (id, notificationData) => apiCall(`/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(notificationData),
  }),
  delete: (id) => apiCall(`/notifications/${id}`, { method: 'DELETE' }),
};
