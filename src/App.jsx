import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeAuth, isAuthenticated } from './services/auth';
import { ProtectedRoute, AdminRoute, StudentRoute } from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import ScrollToTop from './components/common/ScrollToTop';
import Login from './components/common/Login';
import Register from './components/common/Register';
import Home from './pages/common/Home';
import Rooms from './pages/common/Rooms';
import StudentPortal from './pages/student/StudentPortal';
import AdminDashboard from './pages/admin/AdminDashboard';
import Unauthorized from './pages/common/Unauthorized';
import Students from './pages/admin/Students';
import Applications from './pages/admin/Applications';
import RoomPreferences from './components/student/RoomPreferences';
import MaintenanceRequest from './components/student/MaintenanceRequest';
import PaymentSystem from './components/student/PaymentSystem';
import CommunicationHub from './components/student/CommunicationHub';
import BillingSystem from './components/admin/BillingSystem';
import AdminAnalytics from './components/admin/AdminAnalytics';
import MyRoom from './pages/student/MyRoom';
import MaintenanceManagement from './components/admin/MaintenanceManagement';
import { Toaster } from './components/ui/toaster';

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Navbar>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
             <Route
              path="/admin/billings"
              element={
                <AdminRoute>
                  <BillingSystem />
                </AdminRoute>
              }
            />
             <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/rooms"
              element={
                <AdminRoute>
                  <Rooms />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminRoute>
                  <Students />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <AdminRoute>
                  <Applications />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/maintenance"
              element={
                <AdminRoute>
                  <MaintenanceManagement />
                </AdminRoute>
              }
            />

            {/* Student routes */}
            <Route
              path="/student/dashboard"
              element={
                <StudentRoute>
                  <StudentPortal />
                </StudentRoute>
              }
            />
            <Route
              path="/student/my-room"
              element={
                <StudentRoute>
                  <MyRoom />
                </StudentRoute>
              }
            />
            <Route
              path="/student/room-preferences"
              element={
                <StudentRoute>
                  <RoomPreferences />
                </StudentRoute>
              }
            />
            <Route
              path="/student/maintenance"
              element={
                <StudentRoute>
                  <MaintenanceRequest />
                </StudentRoute>
              }
            />
            <Route
              path="/student/payments"
              element={
                <StudentRoute>
                  <PaymentSystem />
                </StudentRoute>
              }
            />
            <Route
              path="/student/communication"
              element={
                <StudentRoute>
                  <CommunicationHub />
                </StudentRoute>
              }
            />

            {/* Catch all route - redirect to home if not found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Navbar>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;