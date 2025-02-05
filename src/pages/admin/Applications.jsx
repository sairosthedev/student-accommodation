import React, { useState, useEffect } from 'react';
import { fetchApplications, updateApplicationStatus } from '../../services/api';
import { 
  Calendar, 
  Phone, 
  Mail, 
  BookOpen, 
  GraduationCap, 
  Home, 
  Clock,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import RoomPreferences from '../../components/student/RoomPreferences';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const { data } = await fetchApplications();
      setApplications(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      await loadApplications();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update application status');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' ? true : app.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      app.firstName.toLowerCase().includes(searchLower) ||
      app.lastName.toLowerCase().includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower) ||
      app.studentId.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Room Applications</h1>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Processing</p>
                <p className="text-2xl font-bold text-gray-900">2 Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search applications..."
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
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg capitalize transition-all ${
                      filter === status
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

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="col-span-2">Student</div>
            <div>Status</div>
            <div>Room</div>
            <div>Program</div>
            <div>Submitted</div>
            <div>Actions</div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-100">
            {filteredApplications.map((application) => (
              <div key={application._id} className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                <div className="col-span-2">
                  <h3 className="font-medium text-gray-900">
                    {application.firstName} {application.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    {application.email}
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {application.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {application.roomId?.roomNumber || 'N/A'}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {application.program}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  {application.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'approved')}
                        className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'rejected')}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No applications found</div>
                <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 