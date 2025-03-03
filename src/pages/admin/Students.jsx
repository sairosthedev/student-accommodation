import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import StudentList from '../../components/admin/StudentList';
import AddStudentForm from '../../components/admin/AddStudentForm';
import RoomList from '../../components/admin/RoomList';
import { assignRoom, fetchRooms } from '../../services/api';
import { useIsMobile } from '../../hooks/use-mobile';
import { BACKEND_URL } from '../../urls';

const studentsUrl = `${BACKEND_URL}/students`;

export default function Students() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await fetchRooms();
      setRooms(data || []);
    } catch (err) {
      console.error('Failed to load rooms:', err);
      setError('Failed to load rooms');
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    // Load rooms data before showing the dialog
    await loadRooms();
    // Only show dialog if rooms loaded successfully
    if (!error) {
      setShowRoomDialog(true);
    }
  };

  const handleAssignRoom = async (roomId) => {
    try {
      setError(null);
      await assignRoom(roomId, selectedStudent._id);
      await loadRooms(); // Refresh rooms list
      setShowRoomDialog(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign room');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Student Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Add Student</span>
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add New Student</h2>
                    <p className="text-sm text-gray-500 mt-1">Enter student details below</p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <AddStudentForm
                  onStudentAdded={() => {
                    setShowAddForm(false);
                    setSelectedStudent(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <StudentList
          onSelectStudent={handleStudentSelect}
          onAddStudent={() => setShowAddForm(true)}
        />

        {/* Room Selection Dialog */}
        {showRoomDialog && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {isMobile ? 'Select Room' : `Select Room for ${selectedStudent.name}`}
                </h2>
                <button
                  onClick={() => {
                    setShowRoomDialog(false);
                    setSelectedStudent(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 text-sm sm:text-base text-red-700">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : (
                <RoomList
                  rooms={rooms}
                  onAssignStudent={handleAssignRoom}
                  isAdmin={true}
                  hideStudentDialog={true}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}