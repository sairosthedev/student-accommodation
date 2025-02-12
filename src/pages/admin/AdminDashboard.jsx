import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../services/api';
import BillingSystem from '../../components/admin/BillingSystem';
import AdminAnalytics from '../../components/admin/AdminAnalytics';
import { BACKEND_URL } from '../../urls';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalStudents: 0,
    pendingApplications: 0
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dashboardUrl = `${BACKEND_URL}/api/admin/dashboard`;

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [roomsRes, studentsRes, applicationsRes] = await Promise.all([
          axios.get('/rooms'),
          axios.get('/students'),
          axios.get('/applications')
        ]);

        const occupiedRooms = roomsRes.data.filter(room => !room.isAvailable).length;
        const pendingApplications = applicationsRes.data.filter(app => app.status === 'pending').length;

        setStats({
          totalRooms: roomsRes.data.length,
          occupiedRooms,
          totalStudents: studentsRes.data.length,
          pendingApplications
        });
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Welcome back! Here's an overview of your accommodation system.</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {['overview', 'billing', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 rounded-lg capitalize transition-all text-sm flex-1 sm:flex-none ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Rooms</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Occupied Rooms</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.occupiedRooms}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/admin/rooms"
                className="group bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manage Rooms</h3>
                    <p className="text-sm text-gray-600">Add, edit, or remove rooms</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/students"
                className="group bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Manage Students</h3>
                    <p className="text-sm text-gray-600">View and manage student records</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/applications"
                className="group bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                    <p className="text-sm text-gray-600">Review and process applications</p>
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}

        {activeTab === 'billing' && (
          <div className="mt-8">
            <BillingSystem isAdmin={true} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="mt-8">
            <AdminAnalytics />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 