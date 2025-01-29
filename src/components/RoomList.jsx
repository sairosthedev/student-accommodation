import React, { useState, useEffect } from 'react';
import { Search, Users, X, UserMinus } from 'lucide-react';
import StudentList from './StudentList';
import { unassignRoom } from '../services/api';
import Notification from './Notification';
import RoomCard from './RoomCard';

const RoomList = ({ rooms: initialRooms, onAssignStudent }) => {
  const [rooms, setRooms] = useState(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [notification, setNotification] = useState(null);

  // Debug logging
  console.log('RoomList received rooms:', initialRooms);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    console.log('RoomList updating rooms:', initialRooms);
    setRooms(initialRooms);
  }, [initialRooms]);

  const filteredRooms = rooms
    .filter(room => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'available' ? room.occupants?.length === 0 :
        filter === 'occupied' ? !room.occupants?.length === 0 : true;
      return matchesSearch && matchesFilter;
    });

  // Debug logging for filtered rooms
  console.log('Filtered rooms:', filteredRooms);

  const handleAssignStudent = async (room) => {
    setSelectedRoom(room);
    setShowStudentDialog(true);
  };

  const handleStudentSelected = async (student) => {
    try {
      setError('');
      console.log('Selected student:', student);
      console.log('Selected room:', selectedRoom);
      
      if (!selectedRoom || !student) {
        throw new Error('Room or student not selected');
      }
      
      await onAssignStudent(selectedRoom._id, student._id);
      showNotification('Student assigned successfully');
      setShowStudentDialog(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error('Error assigning student:', err);
      setError(err.response?.data?.error || err.message || 'Failed to assign student. Please try again.');
      showNotification('Failed to assign student', 'error');
    }
  };

  const handleRemoveStudent = async (roomId, studentId) => {
    if (!window.confirm('Are you sure you want to remove this student from the room?')) {
      return;
    }

    try {
      setError('');
      const { data: updatedRoom } = await unassignRoom(roomId, studentId);
      
      // Update the rooms list with the server response
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room._id === roomId ? updatedRoom : room
        )
      );
      
      showNotification('Student removed successfully');
    } catch (err) {
      console.error('Error removing student:', err);
      setError(err.response?.data?.error || 'Failed to remove student from room');
      showNotification('Failed to remove student', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            <Users className="h-4 w-4" />
            All
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              filter === 'available'
                ? 'bg-blue-500 text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            <Users className="h-4 w-4" />
            Available
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              filter === 'occupied'
                ? 'bg-blue-500 text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            <Users className="h-4 w-4" />
            Occupied
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          console.log('Rendering RoomCard for room:', room); // Debug logging
          return (
            <RoomCard
              key={room._id}
              room={room}
              onAssignStudent={handleAssignStudent}
              onRemoveStudent={handleRemoveStudent}
            />
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No rooms found matching your criteria</p>
        </div>
      )}

      {/* Student Selection Dialog */}
      {showStudentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Select Student for Room {selectedRoom?.roomNumber}
              </h2>
              <button
                onClick={() => {
                  setShowStudentDialog(false);
                  setSelectedRoom(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <StudentList onSelectStudent={handleStudentSelected} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;