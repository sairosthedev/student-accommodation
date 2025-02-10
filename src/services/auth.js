import axiosInstance from './api';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

// Set auth token for all future requests
const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// Register new user
export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  const { token, user } = response.data;
  setAuthToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user };
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    const { token, user } = response.data;
    setAuthToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.error || 'Failed to login');
  }
};

// Logout user
export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem(USER_KEY);
};

// Get current user
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// Get stored user
export const getStoredUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Initialize auth state from localStorage
export const initializeAuth = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    setAuthToken(token);
  }
};

// Check if user is admin
export const isAdmin = () => {
  const user = getStoredUser();
  return user?.role === 'admin';
};

// Check if user is student
export const isStudent = () => {
  const user = getStoredUser();
  return user?.role === 'student';
}; 