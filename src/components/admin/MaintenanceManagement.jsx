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
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '../../lib/utils';
import instance from '../../services/api';  // Import the configured axios instance

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
  const isMobile = useIsMobile();

  // Fetch maintenance requests and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First try maintenance requests
        console.log('Fetching maintenance requests...');
        const requestsResponse = await instance.get('/maintenance');
        console.log('Maintenance requests response:', requestsResponse.data);

        // Then try stats
        console.log('Fetching maintenance stats...');
        const statsResponse = await instance.get('/maintenance/stats');
        console.log('Maintenance stats response:', statsResponse.data);

        // Transform the data to match the component's expected structure
        const formattedRequests = requestsResponse.data.map(request => ({
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
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error in fetchData:', error);
        console.error('Error stack:', error.stack);
        toast({
          title: 'Error fetching data',
          description: error.response?.data?.error || error.message || 'Please try again later',
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
      const response = await instance.put(`/maintenance/${selectedRequest.id}`, updateForm);

      // Update local state
      setRequests(requests.map(req => 
        req.id === selectedRequest.id ? {
          ...req,
          ...response.data,
          date: new Date(response.data.createdAt).toLocaleDateString(),
          dueDate: response.data.estimatedCompletion ? new Date(response.data.estimatedCompletion).toLocaleDateString() : null
        } : req
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
        description: error.response?.data?.error || error.message,
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
      <div className={cn("container mx-auto px-4 py-8", isMobile ? "max-w-full" : "max-w-7xl")}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <div>
                <h1 className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>Maintenance Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage and track maintenance requests</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center space-x-2 md:space-x-4">
                  <div className="bg-yellow-100 p-2 md:p-3 rounded-lg">
                    <Clock className={cn("text-yellow-600", isMobile ? "h-4 w-4" : "h-6 w-6")} />
                  </div>
                  <div>
                    <p className={cn("text-gray-600", isMobile ? "text-xs" : "text-sm")}>Pending</p>
                    <p className={cn("font-bold text-gray-900", isMobile ? "text-lg" : "text-2xl")}>{stats.pending}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center space-x-2 md:space-x-4">
                  <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                    <Wrench className={cn("text-blue-600", isMobile ? "h-4 w-4" : "h-6 w-6")} />
                  </div>
                  <div>
                    <p className={cn("text-gray-600", isMobile ? "text-xs" : "text-sm")}>In Progress</p>
                    <p className={cn("font-bold text-gray-900", isMobile ? "text-lg" : "text-2xl")}>{stats.inProgress}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center space-x-2 md:space-x-4">
                  <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                    <CheckCircle className={cn("text-green-600", isMobile ? "h-4 w-4" : "h-6 w-6")} />
                  </div>
                  <div>
                    <p className={cn("text-gray-600", isMobile ? "text-xs" : "text-sm")}>Completed</p>
                    <p className={cn("font-bold text-gray-900", isMobile ? "text-lg" : "text-2xl")}>{stats.completed}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center space-x-2 md:space-x-4">
                  <div className="bg-red-100 p-2 md:p-3 rounded-lg">
                    <AlertTriangle className={cn("text-red-600", isMobile ? "h-4 w-4" : "h-6 w-6")} />
                  </div>
                  <div>
                    <p className={cn("text-gray-600", isMobile ? "text-xs" : "text-sm")}>High Priority</p>
                    <p className={cn("font-bold text-gray-900", isMobile ? "text-lg" : "text-2xl")}>{stats.highPriority}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-black text-sm"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {!isMobile && (
                      <button className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <Filter className="h-5 w-5 text-gray-600 mr-2" />
                        <span>Filter</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg capitalize transition-all text-sm',
                          filterStatus === status
                            ? 'bg-black text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        )}
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
                      <th className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        isMobile && "hidden"
                      )}>
                        Request Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        isMobile && "hidden"
                      )}>
                        Priority
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        isMobile && "hidden"
                      )}>
                        Location
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        isMobile && "hidden"
                      )}>
                        Assignee
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        isMobile && "hidden"
                      )}>
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className={cn(
                          "px-4 py-4",
                          isMobile && "hidden"
                        )}>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.title}</div>
                            <div className="text-sm text-gray-500">Submitted on {request.date}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge colorScheme={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </td>
                        <td className={cn(
                          "px-4 py-4",
                          isMobile && "hidden"
                        )}>
                          <Badge colorScheme={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </td>
                        <td className={cn(
                          "px-4 py-4 text-sm text-gray-500",
                          isMobile && "hidden"
                        )}>
                          {request.location}
                        </td>
                        <td className={cn(
                          "px-4 py-4 text-sm text-gray-500",
                          isMobile && "hidden"
                        )}>
                          {request.assignee || 'Unassigned'}
                        </td>
                        <td className={cn(
                          "px-4 py-4 text-sm text-gray-500",
                          isMobile && "hidden"
                        )}>
                          {request.dueDate || 'Not set'}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium">
                          <Menu>
                            <MenuButton
                              as={Button}
                              variant="ghost"
                              size="sm"
                              rightIcon={<MoreVertical className="h-4 w-4" />}
                            >
                              {isMobile ? null : "Actions"}
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
            <Modal 
              isOpen={isUpdateModalOpen} 
              onClose={() => setIsUpdateModalOpen(false)}
              size={isMobile ? "full" : "md"}
            >
              <ModalOverlay />
              <ModalContent className={isMobile ? "m-0 rounded-none" : ""}>
                <ModalHeader className={cn("text-lg", isMobile && "text-center")}>
                  Update Maintenance Request
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl mb={4}>
                    <FormLabel className={cn("text-sm", isMobile && "text-center")}>Status</FormLabel>
                    <Select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                      size={isMobile ? "sm" : "md"}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </Select>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel className={cn("text-sm", isMobile && "text-center")}>Assignee</FormLabel>
                    <Input
                      value={updateForm.assignee}
                      onChange={(e) => setUpdateForm({ ...updateForm, assignee: e.target.value })}
                      placeholder="Enter assignee name"
                      size={isMobile ? "sm" : "md"}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel className={cn("text-sm", isMobile && "text-center")}>Estimated Completion</FormLabel>
                    <Input
                      type="date"
                      value={updateForm.estimatedCompletion}
                      onChange={(e) => setUpdateForm({ ...updateForm, estimatedCompletion: e.target.value })}
                      size={isMobile ? "sm" : "md"}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel className={cn("text-sm", isMobile && "text-center")}>Notes</FormLabel>
                    <Textarea
                      value={updateForm.notes}
                      onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                      placeholder="Add notes about the maintenance request"
                      size={isMobile ? "sm" : "md"}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter className={cn("gap-2", isMobile && "flex-col")}>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsUpdateModalOpen(false)}
                    className={isMobile ? "w-full" : ""}
                  >
                    Cancel
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    onClick={handleUpdateRequest}
                    className={isMobile ? "w-full" : ""}
                  >
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