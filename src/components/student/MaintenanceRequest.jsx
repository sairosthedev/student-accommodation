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
  Plus,
  History,
  Loader2,
} from 'lucide-react';
import instance from '../../services/api';  // Import the configured axios instance
import { useIsMobile } from '../../hooks/use-mobile';
import { BACKEND_URL } from '../../urls';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import usePagination from '../../hooks/Pagination';

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

  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [requestHistory, setRequestHistory] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);

  const {
    currentData: paginatedRequests,
    PaginationComponent
  } = usePagination(filteredRequests, 5); // Show 5 requests per page

  // Fetch user's room information
  useEffect(() => {
    const fetchUserRoom = async () => {
      try {
        // First get the current user's info
        const userResponse = await instance.get('/auth/me');
        const userData = userResponse.data;
        
        if (!userData.studentId) {
          console.warn('No student ID found for current user');
          return; // Continue without room info
        }
        
        // Then get the student's details including room assignment
        try {
          const studentResponse = await instance.get(`/students/${userData.studentId}`);
          const studentData = studentResponse.data;
          
          if (studentData.assignedRoom) {
            setUserRoom(studentData.assignedRoom);
            setRequest(prev => ({ ...prev, room: studentData.assignedRoom._id }));
          } else {
            console.warn('No room assigned to this student');
          }
        } catch (studentError) {
          console.error('Error fetching student details:', studentError);
          // Continue without room info, but show a less severe notification
          toast({
            title: 'Room information unavailable',
            description: 'Proceeding without room information. You can still submit maintenance requests.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast({
          title: 'Authentication error',
          description: 'Please ensure you are logged in correctly',
          status: 'error',
          duration: 5000,
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
        status: 'pending', // Explicitly set the initial status
        room: request.room || null // Allow null room
      };
      
      const response = await instance.post('/maintenance', requestData);
      
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
        room: userRoom?._id || '', // Preserve the room ID if it exists
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
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

  const fetchRequestHistory = async (requestId) => {
    try {
      const response = await instance.get(`/maintenance/${requestId}/history`);
      setRequestHistory(response.data);
    } catch (error) {
      toast({
        title: "Error fetching history",
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchUserRequests();
      toast({
        title: "Refreshed",
        description: "Data has been updated",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error refreshing data",
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const sortRequests = (requests) => {
    return [...requests].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'status':
          const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
          comparison = statusOrder[b.status] - statusOrder[a.status];
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {loading && !showAddForm ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Maintenance Requests</h1>
                <p className="text-sm text-gray-600 mt-1">Track and manage your maintenance requests</p>
              </div>
              <Button 
                variant="outline" 
                onClick={refreshData}
                disabled={refreshing}
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
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
                  {paginatedRequests.map((request) => (
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
                  <div className="p-4 border-t border-gray-100">
                    <PaginationComponent />
                  </div>
                </div>
              ) : (
                /* Desktop Table View - Keep existing table code */
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            className="flex items-center space-x-1 hover:text-gray-700"
                            onClick={() => {
                              setSortBy('date');
                              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            }}
                          >
                            <span>Date</span>
                            {sortBy === 'date' && (
                              <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </button>
                        </th>
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
                      {paginatedRequests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</div>
                            </div>
                          </td>
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
                  <div className="p-4 border-t border-gray-100">
                    <PaginationComponent />
                  </div>
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

            {/* Details Sheet */}
            <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Maintenance Request Details</SheetTitle>
                  <SheetDescription>
                    View complete details of your maintenance request
                  </SheetDescription>
                </SheetHeader>
                {request && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Title</h3>
                      <p className="mt-1">{request.title}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{request.description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="mt-1">{request.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Room</h3>
                      <p className="mt-1">{request.room?.number || 'Not assigned'}</p>
                    </div>
                    {request.images?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Images</h3>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {request.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Request ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* History Sheet */}
            <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Request History</SheetTitle>
                  <SheetDescription>
                    View the history of changes for this maintenance request
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {requestHistory.map((entry, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {entry.action}
                        </span>
                        <span className="text-xs text-gray-500">
                          {entry.timestamp ? 
                            format(new Date(entry.timestamp), 'PPp') : 
                            'Time not available'
                          }
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                      {entry.changedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          by {entry.changedBy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequest;