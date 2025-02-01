import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Room-related endpoints
export const fetchRooms = () => instance.get('/rooms');
export const fetchAvailableRooms = () => instance.get('/rooms/available');
export const addRoom = (roomData) => instance.post('/rooms', roomData);
export const updateRoom = (id, roomData) => instance.put(`/rooms/${id}`, roomData);
export const deleteRoom = async (roomId) => {
  return await instance.delete(`/rooms/${roomId}`);
};

// Student-related endpoints
export const fetchStudents = () => instance.get('/students');
export const addStudent = (studentData) => instance.post('/students', studentData);
export const updateStudent = (id, studentData) => instance.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => instance.delete(`/students/${id}`);

// Application-related endpoints
export const applyForRoom = (applicationData) => instance.post('/applications', applicationData);
export const fetchApplications = () => instance.get('/applications');
export const updateApplicationStatus = (id, status) => instance.put(`/applications/${id}/status`, { status });
export const fetchStudentApplications = (studentId) => instance.get(`/applications/student/${studentId}`);

// Room assignment endpoints
export const assignRoom = (roomId, studentId) => instance.post(`/rooms/${roomId}/assign/${studentId}`);
export const unassignRoom = (roomId, studentId) => instance.post(`/rooms/${roomId}/unassign/${studentId}`);

export default instance;