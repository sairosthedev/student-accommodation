import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update with your backend URL
  timeout: 10000,
});

// Student endpoints
export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (student) => api.post('/students', student);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Room endpoints
export const getRooms = () => api.get('/rooms');
export const getRoom = (id) => api.get(`/rooms/${id}`);
export const createRoom = (room) => api.post('/rooms', room);
export const updateRoomAvailability = (roomId, isAvailable) => 
  api.put(`/rooms/${roomId}/availability`, { isAvailable });
export const assignStudentToRoom = (roomId, studentId) => 
  api.put(`/rooms/${roomId}/assign/${studentId}`);
export const removeStudentFromRoom = (roomId, studentId) => 
  api.put(`/rooms/${roomId}/remove/${studentId}`);

export default api;