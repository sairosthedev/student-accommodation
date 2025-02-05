import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeAuth, isAuthenticated } from './services/auth';
import { ProtectedRoute, AdminRoute, StudentRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import Students from './pages/Students';
import Applications from './pages/Applications';
import RoomPreferences from './components/RoomPreferences';
import MaintenanceRequest from './components/MaintenanceRequest';
import PaymentSystem from './components/PaymentSystem';
import CommunicationHub from './components/CommunicationHub';
import BillingSystem from './components/BillingSystem';
import AdminAnalytics from './components/AdminAnalytics';
import MyRoom from './pages/MyRoom';

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
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
      </div>
    </Router>
  );
}

export default App;