import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Select,
  Input,
  useToast,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { 
  Wrench, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  User
} from 'lucide-react';

const MaintenanceManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    assignee: '',
    notes: '',
    estimatedCompletion: ''
  });
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0
  });

  const toast = useToast();

  // Fetch maintenance requests and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Starting fetch requests with token:', token.substring(0, 20) + '...');

        // First try maintenance requests
        console.log('Fetching maintenance requests...');
        const requestsResponse = await fetch('/api/maintenance', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Maintenance requests response status:', requestsResponse.status);
        
        if (!requestsResponse.ok) {
          const errorText = await requestsResponse.text();
          console.error('Maintenance requests error response:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || 'Failed to fetch maintenance requests');
          } catch (e) {
            throw new Error(`Failed to fetch maintenance requests: ${errorText}`);
          }
        }

        // Then try stats
        console.log('Fetching maintenance stats...');
        const statsResponse = await fetch('/api/maintenance/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Maintenance stats response status:', statsResponse.status);

        if (!statsResponse.ok) {
          const errorText = await statsResponse.text();
          console.error('Maintenance stats error response:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || 'Failed to fetch maintenance stats');
          } catch (e) {
            throw new Error(`Failed to fetch maintenance stats: ${errorText}`);
          }
        }

        console.log('Both responses ok, parsing JSON...');

        const requestsData = await requestsResponse.json();
        const statsData = await statsResponse.json();

        console.log('Received maintenance requests:', requestsData);
        console.log('Received maintenance stats:', statsData);

        // Transform the data to match the component's expected structure
        const formattedRequests = requestsData.map(request => ({
          id: request._id,
          title: request.title,
          description: request.description,
          status: request.status,
          priority: request.priority,
          location: request.location,
          assignee: request.assignee,
          date: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A',
          dueDate: request.estimatedCompletion ? new Date(request.estimatedCompletion).toLocaleDateString() : null,
          notes: request.notes
        }));

        console.log('Formatted requests:', formattedRequests);

        setRequests(formattedRequests);
        setStats(statsData);
      } catch (error) {
        console.error('Error in fetchData:', error);
        console.error('Error stack:', error.stack);
        toast({
          title: 'Error fetching data',
          description: error.message || 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleUpdateRequest = async () => {
    try {
      const response = await fetch(`/api/maintenance/${selectedRequest._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update request');
      }

      const updatedRequest = await response.json();
      
      // Update local state
      setRequests(requests.map(req => 
        req._id === updatedRequest._id ? updatedRequest : req
      ));

      toast({
        title: 'Request updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast({
        title: 'Error updating request',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assignee?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Maintenance Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage and track maintenance requests</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
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
                  <div className="bg-blue-100 p-3 rounded-lg">
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
                  <div className="bg-green-100 p-3 rounded-lg">
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
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.highPriority}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
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
                    <button className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <Filter className="h-5 w-5 text-gray-600 mr-2" />
                      <span>Filter</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg capitalize transition-all ${
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

              {/* Requests Table */}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.title}</div>
                            <div className="text-sm text-gray-500">Submitted on {request.date}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge colorScheme={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge colorScheme={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {request.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {request.assignee || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {request.dueDate || 'Not set'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <Menu>
                            <MenuButton
                              as={Button}
                              variant="ghost"
                              size="sm"
                              rightIcon={<MoreVertical className="h-4 w-4" />}
                            >
                              Actions
                            </MenuButton>
                            <MenuList>
                              <MenuItem onClick={() => {
                                setSelectedRequest(request);
                                setUpdateForm({
                                  status: request.status,
                                  assignee: request.assignee || '',
                                  notes: request.notes || '',
                                  estimatedCompletion: request.dueDate || ''
                                });
                                setIsUpdateModalOpen(true);
                              }}>
                                Update Status
                              </MenuItem>
                              <MenuItem>View Details</MenuItem>
                              <MenuItem>Assign Staff</MenuItem>
                            </MenuList>
                          </Menu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Update Request Modal */}
            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Update Maintenance Request</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl mb={4}>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </Select>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Assignee</FormLabel>
                    <Input
                      value={updateForm.assignee}
                      onChange={(e) => setUpdateForm({ ...updateForm, assignee: e.target.value })}
                      placeholder="Enter assignee name"
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Estimated Completion</FormLabel>
                    <Input
                      type="date"
                      value={updateForm.estimatedCompletion}
                      onChange={(e) => setUpdateForm({ ...updateForm, estimatedCompletion: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      value={updateForm.notes}
                      onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                      placeholder="Add notes about the maintenance request"
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={() => setIsUpdateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleUpdateRequest}>
                    Update Request
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default MaintenanceManagement; 