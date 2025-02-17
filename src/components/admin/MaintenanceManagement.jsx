import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  UserPlus,
  History,
  Loader2,
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import instance from '../../services/api';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MaintenanceManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
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
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [requestHistory, setRequestHistory] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [requestsResponse, statsResponse] = await Promise.all([
          instance.get('/maintenance'),
          instance.get('/maintenance/stats')
        ]);

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
          notes: request.notes,
          updatedAt: request.updatedAt || request.createdAt
        }));

        setRequests(formattedRequests);
        setStats(statsResponse.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: error.response?.data?.error || error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await instance.get('/staff/maintenance');
        setAvailableStaff(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching staff",
          description: error.response?.data?.error || error.message
        });
      }
    };

    fetchStaff();
  }, []);

  const fetchRequestHistory = async (requestId) => {
    try {
      const response = await instance.get(`/maintenance/${requestId}/history`);
      setRequestHistory(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching history",
        description: error.response?.data?.error || error.message
      });
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const [requestsResponse, statsResponse] = await Promise.all([
        instance.get('/maintenance'),
        instance.get('/maintenance/stats')
      ]);

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
        notes: request.notes,
        updatedAt: request.updatedAt || request.createdAt
      }));

      setRequests(formattedRequests);
      setStats(statsResponse.data);
      
      toast({
        title: "Refreshed",
        description: "Data has been updated"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error refreshing data",
        description: error.response?.data?.error || error.message
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
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  };

  const handleUpdateRequest = async () => {
    try {
      const response = await instance.put(`/maintenance/${selectedRequest.id}`, updateForm);
      
      setRequests(requests.map(req => 
        req.id === selectedRequest.id ? {
          ...req,
          ...response.data,
          date: new Date(response.data.createdAt).toLocaleDateString(),
          dueDate: response.data.estimatedCompletion ? new Date(response.data.estimatedCompletion).toLocaleDateString() : null
        } : req
      ));

      toast({
        title: "Success",
        description: "Request updated successfully"
      });
      
      setIsUpdateDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || error.message
      });
    }
  };

  const handleAssignStaff = async () => {
    try {
      const response = await instance.put(`/maintenance/${selectedRequest.id}/assign`, {
        assignee: updateForm.assignee
      });
      
      setRequests(requests.map(req => 
        req.id === selectedRequest.id ? {
          ...req,
          assignee: response.data.assignee
        } : req
      ));

      toast({
        title: "Success",
        description: "Staff assigned successfully"
      });
      
      setIsAssignDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || error.message
      });
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
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Maintenance Management</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage and track maintenance requests</p>
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
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
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

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
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

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
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

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highPriority}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className={`capitalize text-sm flex-1 sm:flex-none ${
                    filterStatus === status
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortRequests(filteredRequests).map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.title}</div>
                            <div className="text-xs text-gray-500">Submitted on {request.date}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant={getStatusBadgeVariant(request.status)}>
                                  {request.status}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {request.updatedAt ? (
                                  <p>Last updated: {format(new Date(request.updatedAt), 'PPp')}</p>
                                ) : (
                                  <p>Last updated: Not available</p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant={getPriorityBadgeVariant(request.priority)}>
                            {request.priority}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{request.location}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{request.assignee || 'Unassigned'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{request.dueDate || 'Not set'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedRequest(request);
                                setUpdateForm({
                                  status: request.status,
                                  assignee: request.assignee || '',
                                  notes: request.notes || '',
                                  estimatedCompletion: request.dueDate || ''
                                });
                                setIsUpdateDialogOpen(true);
                              }}>
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedRequest(request);
                                setIsDetailsSheetOpen(true);
                              }}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedRequest(request);
                                setUpdateForm({
                                  ...updateForm,
                                  assignee: request.assignee || ''
                                });
                                setIsAssignDialogOpen(true);
                              }}>
                                Assign Staff
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedRequest(request);
                                fetchRequestHistory(request.id);
                                setIsHistorySheetOpen(true);
                              }}>
                                <History className="h-4 w-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {sortRequests(filteredRequests).map((request) => (
                <div key={request.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{request.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">Submitted on {request.date}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request);
                            setUpdateForm({
                              status: request.status,
                              assignee: request.assignee || '',
                              notes: request.notes || '',
                              estimatedCompletion: request.dueDate || ''
                            });
                            setIsUpdateDialogOpen(true);
                          }}>
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request);
                            setIsDetailsSheetOpen(true);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request);
                            setUpdateForm({
                              ...updateForm,
                              assignee: request.assignee || ''
                            });
                            setIsAssignDialogOpen(true);
                          }}>
                            Assign Staff
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request);
                            fetchRequestHistory(request.id);
                            setIsHistorySheetOpen(true);
                          }}>
                            <History className="h-4 w-4 mr-2" />
                            View History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(request.priority)}>
                        {request.priority}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="text-gray-900 mt-0.5">{request.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Assignee:</span>
                        <p className="text-gray-900 mt-0.5">{request.assignee || 'Unassigned'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Due Date:</span>
                        <p className="text-gray-900 mt-0.5">{request.dueDate || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Maintenance Request</DialogTitle>
              <DialogDescription>
                Update the status and details of this maintenance request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={updateForm.status}
                  onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Input
                  value={updateForm.assignee}
                  onChange={(e) => setUpdateForm({ ...updateForm, assignee: e.target.value })}
                  placeholder="Enter assignee name"
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Completion</Label>
                <Input
                  type="date"
                  value={updateForm.estimatedCompletion}
                  onChange={(e) => setUpdateForm({ ...updateForm, estimatedCompletion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  placeholder="Add notes about the maintenance request"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRequest}>
                Update Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Maintenance Request Details</SheetTitle>
              <SheetDescription>
                View complete details of the maintenance request
              </SheetDescription>
            </SheetHeader>
            {selectedRequest && (
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="mt-1">{selectedRequest.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{selectedRequest.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className="mt-1" variant={getStatusBadgeVariant(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <Badge className="mt-1" variant={getPriorityBadgeVariant(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1">{selectedRequest.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assignee</h3>
                  <p className="mt-1">{selectedRequest.assignee || 'Unassigned'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
                  <p className="mt-1">{selectedRequest.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                  <p className="mt-1">{selectedRequest.dueDate || 'Not set'}</p>
                </div>
                {selectedRequest.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1">{selectedRequest.notes}</p>
                  </div>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>

        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Staff Member</DialogTitle>
              <DialogDescription>
                Assign a staff member to this maintenance request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Staff Member</Label>
                <Select
                  value={updateForm.assignee}
                  onValueChange={(value) => setUpdateForm({ ...updateForm, assignee: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignStaff}>
                Assign Staff
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
      </div>
    </div>
  );
};

export default MaintenanceManagement;