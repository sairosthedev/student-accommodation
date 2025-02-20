import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  X, 
  UserMinus, 
  Filter,
  Plus,
  MoreVertical,
  Home,
  UserPlus,
  DoorOpen,
  CheckCircle
} from 'lucide-react';
import StudentList from './StudentList';
import { unassignRoom, deleteRoom } from '../../services/api';
import Notification from '../common/Notification';
import RoomCard from '../common/RoomCard';
import { useIsMobile } from '../../hooks/use-mobile';
import usePagination from '../../hooks/Pagination';

const RoomList = ({ rooms: initialRooms, onAssignStudent, onRoomDeleted, isAdmin = false, onApplyClick, hideStudentDialog = false }) => {
  const [rooms, setRooms] = useState(Array.isArray(initialRooms) ? initialRooms : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [notification, setNotification] = useState(null);
  const isMobile = useIsMobile();

  // Debug logging
  console.log('RoomList received rooms:', initialRooms);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (Array.isArray(initialRooms)) {
      setRooms(initialRooms);
    }
  }, [initialRooms]);

  const filteredRooms = rooms
    .filter(room => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'available' ? room.occupants?.length === 0 :
        filter === 'occupied' ? room.occupants?.length > 0 : true;
      return matchesSearch && matchesFilter;
    });

  // Debug logging for filtered rooms
  console.log('Filtered rooms:', filteredRooms);

  const {
    currentData: paginatedRooms,
    PaginationComponent
  } = usePagination(filteredRooms, 6); // Show 6 rooms per page

  const handleAssignStudent = async (room) => {
    if (hideStudentDialog) {
      // Direct assignment without student selection
      await onAssignStudent(room._id);
      showNotification('Room assigned successfully');
    } else {
      // Show student selection dialog
      setSelectedRoom(room);
      setShowStudentDialog(true);
    }
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

  const handleEditRoom = (room) => {
    // TODO: Implement edit room functionality
    console.log('Edit room:', room);
  };

  const handleDeleteRoom = async (room) => {
    if (!window.confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
      return;
    }

    try {
      setError('');
      await deleteRoom(room._id);
      showNotification(`Room ${room.roomNumber} deleted successfully`);
      
      // Call the parent's onRoomDeleted callback to refresh the rooms list
      if (onRoomDeleted) {
        onRoomDeleted();
      }
    } catch (err) {
      console.error('Error deleting room:', err);
      setError(err.response?.data?.error || 'Failed to delete room');
      showNotification('Failed to delete room', 'error');
    }
  };

  const getOccupancyColor = (room) => {
    if (!room.occupants) return 'bg-gray-100 text-gray-800';
    const occupancyRate = room.occupants.length / room.capacity;
    if (occupancyRate === 0) return 'bg-green-100 text-green-800';
    if (occupancyRate < 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getOccupancyText = (room) => {
    if (!room.occupants) return 'Unknown';
    const occupancyRate = room.occupants.length / room.capacity;
    if (occupancyRate === 0) return 'Available';
    if (occupancyRate < 1) return 'Partially Occupied';
    return 'Full';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                <Home className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Rooms</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{rooms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                <DoorOpen className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Available</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {rooms.filter(room => !room.occupants || room.occupants.length === 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Partially Occupied</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {rooms.filter(room => room.occupants && room.occupants.length > 0 && room.occupants.length < room.capacity).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Full</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {rooms.filter(room => room.occupants && room.occupants.length === room.capacity).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Toolbar */}
          <div className="p-3 md:p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm md:text-base rounded-lg border border-gray-200 focus:border-black focus:ring-black"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                </div>
                <button className="inline-flex items-center px-3 md:px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
                  <Filter className="h-4 w-4 md:h-5 md:w-5 text-gray-600 mr-2" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Room Cards */}
          {isMobile && (
            <div className="divide-y divide-gray-100">
              {paginatedRooms.map((room) => (
                <div key={room._id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">Room {room.roomNumber}</h3>
                      <p className="text-sm text-gray-500">Floor: {room.floorLevel}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(room)}`}>
                      {getOccupancyText(room)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="text-gray-500">Capacity:</span> {room.occupants?.length || 0} / {room.capacity}
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span> {room.type}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Price:</span> ${room.price}/month
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => handleAssignStudent(room)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                          title="Assign Student"
                        >
                          <UserPlus className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Delete Room"
                        >
                          <UserMinus className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onApplyClick(room)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          room.isAvailable 
                            ? 'bg-black text-white hover:bg-gray-900'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!room.isAvailable}
                      >
                        {room.isAvailable ? 'Apply' : 'Not Available'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="p-4 border-t border-gray-100">
                <PaginationComponent />
              </div>
            </div>
          )}

          {/* Desktop Table View */}
          {!isMobile && (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600">
                <div className="col-span-2">Room</div>
                <div>Status</div>
                <div>Capacity</div>
                <div>Type</div>
                <div>Price</div>
                <div>Actions</div>
              </div>

              {/* Table Content */}
              <div className="divide-y divide-gray-100">
                {paginatedRooms.map((room) => (
                  <div key={room._id} className="grid grid-cols-7 gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
                    <div className="col-span-2">
                      <h3 className="font-medium text-gray-900">Room {room.roomNumber}</h3>
                      <p className="text-sm text-gray-500">Floor: {room.floorLevel}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(room)}`}>
                        {getOccupancyText(room)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {room.occupants?.length || 0} / {room.capacity}
                    </div>
                    <div className="text-sm text-gray-600">
                      {room.type}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${room.price}/month
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleAssignStudent(room)}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                            title="Assign Student"
                          >
                            <UserPlus className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                            title="Delete Room"
                          >
                            <UserMinus className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onApplyClick(room)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            room.isAvailable 
                              ? 'bg-black text-white hover:bg-gray-900'
                              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!room.isAvailable}
                        >
                          {room.isAvailable ? 'Apply' : 'Not Available'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <PaginationComponent />
              </div>
            </>
          )}

          {paginatedRooms.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <div className="text-gray-500 text-base md:text-lg">No rooms found</div>
              <p className="text-sm md:text-base text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Student Selection Dialog - only show if not hidden */}
      {showStudentDialog && !hideStudentDialog && (
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