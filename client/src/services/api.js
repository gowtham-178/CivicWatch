import { API_BASE_URL } from '../config';

/**
 * Helper to get authorization header from stored JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('civicwatch_token') || localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null') {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

/**
 * Generic API HTTP Request Wrapper
 */
export async function apiFetch(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...getAuthHeaders(),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && data.error && data.error.includes('expired')) {
      localStorage.removeItem('civicwatch_token');
      localStorage.removeItem('token');
      localStorage.removeItem('civicwatch_user');
    }
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * API Service Methods
 */
export const authAPI = {
  login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  verifyOtp: (payload) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) }),
  resendOtp: (payload) => apiFetch('/auth/resend-otp', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: () => apiFetch('/auth/myprofile'),
  updateProfile: (data) => apiFetch('/auth/myprofile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (passwords) => apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify(passwords) })
};

export const reportsAPI = {
  getAll: (params = '') => apiFetch(`/reports${params ? `?${params}` : ''}`),
  getMyReports: () => apiFetch('/reports/my-reports'),
  create: (formData) => apiFetch('/reports', { method: 'POST', body: formData }),
  update: (id, data) => apiFetch(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleUpvote: (id) => apiFetch(`/reports/${id}/upvote`, { method: 'POST' })
};

export const adminAPI = {
  getDashboard: () => apiFetch('/admin/dashboard')
};
