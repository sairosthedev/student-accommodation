import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Select,
  Image,
  SimpleGrid,
  Progress,
  Badge,
} from '@chakra-ui/react';
import { 
  Wrench, 
  Upload, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Camera,
  Star,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Plus
} from 'lucide-react';
import instance from '../../services/api';  // Import the configured axios instance
import { useIsMobile } from '../../hooks/use-mobile';
import { BACKEND_URL } from '../../urls';

const MaintenanceRequest = () => {
  const [request, setRequest] = useState({
    title: '',
    description: '',
    priority: '',
    location: '',
    images: [],
    room: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [userRoom, setUserRoom] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    avgResolution: '0 Days'
  });
  
  const toast = useToast();
  const isMobile = useIsMobile();

  // Fetch user's room information
  useEffect(() => {
    const fetchUserRoom = async () => {
      try {
        // First get the current user's info
        const userResponse = await instance.get('/auth/me');
        const userData = userResponse.data;
        
        if (!userData.studentId) {
          throw new Error('No student ID found for current user');
        }
        
        // Then get the student's details including room assignment
        const studentResponse = await instance.get(`/students/${userData.studentId}`);
        const studentData = studentResponse.data;
        
        if (!studentData.assignedRoom) {
          throw new Error('No room assigned to this student');
        }
        
        setUserRoom(studentData.assignedRoom);
        setRequest(prev => ({ ...prev, room: studentData.assignedRoom._id }));
      } catch (error) {
        console.error('Error fetching user room:', error);
        toast({
          title: 'Error fetching room information',
          description: error.message || 'Failed to fetch room information',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchUserRoom();
  }, []);

  // Fetch user's maintenance requests and stats
  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const [requestsResponse, statsResponse] = await Promise.all([
        instance.get('/maintenance/user'),  // Uses configured baseURL and auth headers
        instance.get('/maintenance/user/stats')
      ]);

      // Responses are already JSON with axios
      const requests = requestsResponse.data;
      const stats = statsResponse.data;

      setUserRequests(requests);
      setStats(stats);
      setError(null);

    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      setError(error.response?.data?.error || 'Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await instance.post('/maintenance/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Ensure we have an array of image URLs
      const imageUrls = Array.isArray(response.data.imageUrls) 
        ? response.data.imageUrls 
        : response.data.imageUrl 
          ? [response.data.imageUrl]
          : [];
      
      setRequest(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));

      toast({
        title: 'Images uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error uploading images',
        description: error.response?.data?.message || 'Failed to upload images',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.room) {
      toast({
        title: 'Room information required',
        description: 'Please wait while we fetch your room information',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate required fields
    if (!request.title || !request.description || !request.priority || !request.location) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields: title, description, priority, and location',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate priority
    if (!['low', 'medium', 'high'].includes(request.priority)) {
      toast({
        title: 'Invalid priority',
        description: 'Priority must be low, medium, or high',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...request,
        status: 'pending' // Explicitly set the initial status
      };
      
      // Debug logging
      console.log('Auth token:', localStorage.getItem('auth_token'));
      console.log('Submitting maintenance request with data:', requestData);
      
      const response = await instance.post('/maintenance', requestData);
      console.log('Server response:', response.data);
      
      // Update local state with the new request
      setUserRequests(prev => [response.data, ...prev]);
      
      toast({
        title: 'Maintenance request submitted!',
        description: 'We will process your request soon.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setRequest({
        title: '',
        description: '',
        priority: '',
        location: '',
        images: [],
        room: userRoom?._id || '', // Preserve the room ID
      });
      setShowAddForm(false);
      
      // Refresh requests to get updated stats
      fetchUserRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      const errorMessage = error.response?.data?.error || 
                         (error.response?.data?.details ? 
                           Object.values(error.response.data.details).join(', ') : 
                           'Failed to submit request');
      
      toast({
        title: 'Error submitting request',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = userRequests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assignee?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Update any direct URL references
  const uploadUrl = `${BACKEND_URL}/maintenance/upload`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {loading && !showAddForm ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Maintenance Requests</h1>
                <p className="text-sm text-gray-600 mt-1">Track and manage maintenance issues</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
              >
                <Plus className="h-5 w-5 mr-2" />
                <span>New Request</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Wrench className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Resolution</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgResolution}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm">
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-black"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <Filter className="h-5 w-5 text-gray-600 mr-2" />
                      <span>Filter</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 sm:px-4 py-2 rounded-lg capitalize transition-all text-sm sm:text-base ${
                          filterStatus === status
                            ? 'bg-black text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requests List - Mobile View */}
              {isMobile ? (
                <div className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <div key={request._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{request.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Location:</span> {request.location}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Assignee:</span> {request.assignee || 'Unassigned'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Due Date:</span> {request.dueDate ? new Date(request.dueDate).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop Table View - Keep existing table code */
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{request.title}</div>
                              <div className="text-sm text-gray-500">Submitted on {new Date(request.createdAt).toLocaleDateString()}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                              {request.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {request.location}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {request.assignee || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {request.dueDate ? new Date(request.dueDate).toLocaleDateString() : 'Not set'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* New Request Form */}
            {showAddForm && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">New Maintenance Request</h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={request.title}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          name="description"
                          value={request.description}
                          onChange={handleChange}
                          rows={4}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                          name="priority"
                          value={request.priority}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                          required
                        >
                          <option value="">Select Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={request.location}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="mt-1 block w-full"
                        />
                      </div>
                      {request.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {request.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
                          disabled={loading}
                        >
                          {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequest;