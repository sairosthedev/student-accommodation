import React, { useState, useEffect } from 'react';
import { Search, Users, X, UserMinus } from 'lucide-react';
import StudentList from './StudentList';
import { unassignRoom } from '../services/api';
import Notification from './Notification';

const RoomCard = ({ room, onAssignStudent, onRemoveStudent }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Room {room.roomNumber}</h3>
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          room.occupants?.length === 0
            ? 'bg-green-100 text-green-800'
            : room.occupants?.length >= room.capacity
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {room.occupants?.length === 0
          ? 'Available'
          : room.occupants?.length >= room.capacity
          ? 'Full'
          : 'Partially Occupied'}
      </span>
    </div>
    
    {room.image && (
      <div className="mb-4">
        <img 
          src={room.image} 
          alt={`Room ${room.roomNumber}`} 
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300?text=Room+Image';
          }}
        />
      </div>
    )}

    <div className="space-y-3 mb-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Type:</span>
        <span className="font-medium capitalize">{room.type || 'Not specified'}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Price:</span>
        <span className="font-medium">
          {typeof room.price === 'number' 
            ? `$${room.price.toLocaleString()}/semester`
            : 'Price not set'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Capacity:</span>
        <span className="font-medium">
          {(room.occupants?.length || 0)}/{room.capacity || 0}
        </span>
      </div>
      {room.amenities && room.amenities.length > 0 && (
        <div>
          <span className="text-gray-500 block mb-1">Amenities:</span>
          <div className="flex flex-wrap gap-1">
            {room.amenities.map((amenity, index) => (
              <span 
                key={index}
                className="bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
      <div>
        <span className="text-gray-500 block mb-1">Occupants:</span>
        {room.occupants && room.occupants.length > 0 ? (
          <div className="space-y-2">
            {room.occupants.map(student => (
              <div key={student._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <button
                  onClick={() => onRemoveStudent(room._id, student._id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Remove student from room"
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No occupants</p>
        )}
      </div>
    </div>

    <button
      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
        !room.occupants?.length === 0 || (room.occupants && room.occupants.length >= room.capacity)
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
      disabled={!room.occupants?.length === 0 || (room.occupants && room.occupants.length >= room.capacity)}
      onClick={() => onAssignStudent(room)}
    >
      {!room.occupants?.length === 0 
        ? 'Room Occupied' 
        : room.occupants && room.occupants.length >= room.capacity 
        ? 'Room Full' 
        : 'Assign Student'}
    </button>
  </div>
);

const RoomList = ({ rooms: initialRooms, onAssignStudent }) => {
  const [rooms, setRooms] = useState(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
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
        {filteredRooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            onAssignStudent={handleAssignStudent}
            onRemoveStudent={handleRemoveStudent}
          />
        ))}
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