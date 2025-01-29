import React, { useState, useEffect } from 'react';
import { fetchApplications, updateApplicationStatus } from '../services/api';
import { Calendar, Phone, Mail, BookOpen, GraduationCap, Home, Clock } from 'lucide-react';

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Room Applications</h1>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  filter === status
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {filteredApplications.map((application) => (
          <div
            key={application._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Student Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {application.firstName} {application.lastName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {application.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {application.phone}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {application.program}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Year {application.yearOfStudy}
                    </div>
                  </div>
                </div>

                {/* Room & Timeline Info */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Home className="h-4 w-4 mr-2" />
                    Room: {application.roomId?.roomNumber || 'N/A'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                  {application.processedAt && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Processed: {new Date(application.processedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Special Requirements & Actions */}
                <div className="space-y-4">
                  {application.specialRequirements && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Special Requirements:</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
                        {application.specialRequirements}
                      </p>
                    </div>
                  )}
                  {application.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'approved')}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'rejected')}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredApplications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-500 text-lg">No applications found</div>
            <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
} 