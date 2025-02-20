import axios from 'axios';
import { BACKEND_URL } from '../urls';

// Create the axios instance with the correct configuration
const instance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request logging in development
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        headers: config.headers,
        fullUrl: `${config.baseURL}${config.url}`
      });
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
        url: response.config.url,
        headers: response.headers
      });
    }
    return response;
  },
  (error) => {
    // Log detailed error information
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data,
      headers: error.config?.headers
    };
    
    console.error('API Error Details:', errorDetails);

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Enhance error object with response data
    error.details = errorDetails;
    return Promise.reject(error);
  }
);

// Helper function to handle API responses with enhanced error handling
const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    // Log successful response
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    // Return the data directly
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error('API call failed:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      requestConfig: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Enhance error object with response data
    const enhancedError = {
      message: error.response?.data?.error || error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
      details: error.details
    };

    // Log the enhanced error
    console.error('Enhanced error:', enhancedError);
    
    throw enhancedError;
  }
};

// Room-related endpoints
export const fetchRooms = async () => {
  try {
    console.log('Making fetchRooms API request...');
    const response = await instance.get('/rooms');
    console.log('fetchRooms response:', response);
    
    if (response.status === 200 && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in fetchRooms:', error);
    throw error;
  }
};
export const fetchAvailableRooms = async () => {
  try {
    const response = await instance.get('/rooms/available');
    if (response.status === 200 && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    throw error;
  }
};
export const addRoom = (roomData) => handleApiResponse(() => instance.post('/rooms', roomData));
export const updateRoom = (id, roomData) => handleApiResponse(() => instance.put(`/rooms/${id}`, roomData));
export const deleteRoom = (roomId) => handleApiResponse(() => instance.delete(`/rooms/${roomId}`));

// Student-related endpoints
export const fetchStudents = async () => {
  try {
    console.log('Making fetchStudents API request...');
    const response = await instance.get('/students');
    console.log('fetchStudents response:', response);
    
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in fetchStudents:', error);
    throw error;
  }
};
export const addStudent = (studentData) => handleApiResponse(() => instance.post('/students', studentData));
export const updateStudent = (id, studentData) => handleApiResponse(() => instance.put(`/students/${id}`, studentData));
export const deleteStudent = (id) => handleApiResponse(() => instance.delete(`/students/${id}`));
export const fetchStudentRoomDetails = (studentId) => handleApiResponse(() => instance.get(`/students/${studentId}/room`));

// Application-related endpoints
export const submitApplication = (applicationData) => {
  // Ensure all required fields are present and properly formatted
  const formattedData = {
    ...applicationData,
    roomId: applicationData.roomId?.toString(), // Convert roomId to string if present
    preferences: {
      floorLevel: applicationData.preferences?.floorLevel || 'ground',
      roommateGender: applicationData.preferences?.roommateGender || 'same',
      quietStudyArea: Boolean(applicationData.preferences?.quietStudyArea),
      roomType: applicationData.preferences?.roomType || 'single',
      studyHabits: applicationData.preferences?.studyHabits || 'early',
      sleepSchedule: applicationData.preferences?.sleepSchedule || 'medium'
    }
  };

  // Log the formatted data before submission
  console.log('Submitting formatted application data:', formattedData);

  return handleApiResponse(() => 
    instance.post('/applications', formattedData)
  );
};

export const applyForRoom = (roomId, applicationData) => {
  // Ensure roomId is properly formatted
  const formattedData = {
    ...applicationData,
    roomId: roomId, // Make sure roomId is passed as a string
    preferences: {
      floorLevel: applicationData.preferences?.floorLevel || 'ground',
      roommateGender: applicationData.preferences?.roommateGender || 'same',
      quietStudyArea: Boolean(applicationData.preferences?.quietStudyArea),
      roomType: applicationData.preferences?.roomType || 'single',
      studyHabits: applicationData.preferences?.studyHabits || 'early',
      sleepSchedule: applicationData.preferences?.sleepSchedule || 'medium'
    }
  };

  // Log the formatted data before submission
  console.log('Submitting application with formatted data:', formattedData);

  return handleApiResponse(() => 
    instance.post('/applications', formattedData)
  );
};

export const verifyApplicationCode = async (applicationCode, email) => {
  try {
    console.log('Verifying application code:', { applicationCode, email });
    const response = await instance.post('/applications/verify', { 
      applicationCode, 
      email: email.toLowerCase() 
    });
    
    // Log successful response
    console.log('Verification successful:', response.data);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Verification error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        data: error.config?.data
      }
    });
    
    throw {
      message: error.response?.data?.error || 'Failed to verify application code',
      status: error.response?.status || 500,
      data: error.response?.data || null
    };
  }
};

export const fetchApplications = () => handleApiResponse(() => instance.get('/applications'));
export const updateApplicationStatus = (id, status) => {
  // Log the request details
  console.log('Updating application status:', { id, status });
  
  return handleApiResponse(async () => {
    try {
      const response = await instance.put(`/applications/${id}/status`, { status });
      console.log('Status update response:', response);
      return response;
    } catch (error) {
      console.error('Status update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  });
};
export const fetchStudentApplications = (studentId) => handleApiResponse(() => instance.get(`/applications/student/${studentId}`));

// Room assignment endpoints
export const assignRoom = (roomId, studentId) => 
  handleApiResponse(() => instance.post(`/rooms/${roomId}/assign/${studentId}`));
export const unassignRoom = (roomId, studentId) => 
  handleApiResponse(() => instance.post(`/rooms/${roomId}/unassign/${studentId}`));

// Authentication-related API calls
export const register = async (userData) => {
  try {
    console.log('Registering user with data:', userData);
    
    // First verify the application code
    const verifyResponse = await instance.post('/applications/verify', {
      applicationCode: userData.applicationCode,
      email: userData.email.toLowerCase()
    });
    
    console.log('Verification response:', verifyResponse.data);
    
    if (!verifyResponse.data.application) {
      throw new Error('Invalid application code or application not found');
    }

    const applicationData = verifyResponse.data.application;
    console.log('Full application data:', JSON.stringify(applicationData, null, 2));

    // Extract program and studentId from application data
    const { program, studentId: applicationStudentId } = applicationData;

    console.log('Extracted fields:', { program, studentId: applicationStudentId });

    if (!program) {
      console.error('Missing program in application data:', applicationData);
      throw new Error('Your application is missing program information. Please contact support.');
    }

    if (!applicationStudentId) {
      console.error('Missing studentId in application data:', applicationData);
      throw new Error('Your application is missing student ID information. Please contact support.');
    }

    // Now send the registration request with all required data
    const registrationData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email.toLowerCase(),
      password: userData.password,
      phone: userData.phone,
      role: 'student',
      applicationCode: userData.applicationCode,
      program,
      studentId: applicationStudentId // Use the studentId from the application
    };

    console.log('Sending registration data:', JSON.stringify(registrationData, null, 2));
    
    const response = await instance.post('/auth/register', registrationData);
    
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });

    // Enhance error message for specific cases
    let errorMessage = error.response?.data?.error || error.message;
    if (errorMessage.includes('program')) {
      errorMessage = 'Your application is missing program information. Please contact support.';
    } else if (errorMessage.includes('studentId')) {
      errorMessage = 'Your application is missing student ID information. Please contact support.';
    }

    throw {
      message: errorMessage,
      status: error.response?.status || 500,
      data: error.response?.data
    };
  }
};

export const login = (credentials) => 
  handleApiResponse(() => instance.post('/auth/login', credentials));

// Export the axios instance as default
export default instance;

// Export all API functions
export const api = {
  submitApplication,
  applyForRoom,
  verifyApplicationCode,
  register,
  login,
  fetchRooms,
  fetchAvailableRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  fetchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  fetchStudentRoomDetails,
  fetchApplications,
  updateApplicationStatus,
  fetchStudentApplications,
  assignRoom,
  unassignRoom,
};