import React, { useState, useEffect } from 'react';
import { fetchAvailableRooms, applyForRoom } from '../services/api';
import { useNavigate } from 'react-router-dom';
import RoomSearchFilter from '../components/RoomSearchFilter';
import RoomCard from '../components/RoomCard';
import ApplicationModal from '../components/ApplicationModal';
import { 
  Search, 
  Bed, 
  Home, 
  DollarSign, 
  Filter, 
  Settings, 
  Wrench, 
  CreditCard, 
  MessageSquare,
  Bell,
  Calendar,
  Users
} from 'lucide-react';

function StudentPortal() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    roomType: 'all',
    availability: true
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAvailableRooms();
      const availableRooms = response.data || [];
      setRooms(availableRooms);
      setFilteredRooms(availableRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError('Failed to load available rooms. Please try again later.');
      setRooms([]);
      setFilteredRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const filtered = rooms.filter(room => {
      const matchesPrice = room.price >= newFilters.priceRange[0] && room.price <= newFilters.priceRange[1];
      const matchesType = newFilters.roomType === 'all' || room.type === newFilters.roomType;
      const matchesSearch = searchTerm === '' || 
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPrice && matchesType && room.isAvailable && matchesSearch;
    });
    setFilteredRooms(filtered);
  };

  const handleApplyClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      await applyForRoom({
        ...applicationData,
        roomId: selectedRoom._id,
        preferences: {
          ...applicationData.preferences,
          roomType: selectedRoom.type // Override with selected room type
        }
      });
      setIsModalOpen(false);
      // Show success message
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.response?.data?.error || 'Failed to submit application');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    handleFilterChange(filters);
  };

  // Feature navigation cards with improved design
  const featureCards = [
    
    {
      title: 'Maintenance',
      description: 'Submit and track maintenance requests',
      icon: <Wrench className="h-6 w-6" />,
      path: '/student/maintenance',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Payments',
      description: 'Manage your payments and view history',
      icon: <CreditCard className="h-6 w-6" />,
      path: '/student/payments',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Communication',
      description: 'Stay connected with admin and other students',
      icon: <MessageSquare className="h-6 w-6" />,
      path: '/student/communication',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Welcome Back, Student
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              Manage your accommodation and access all student services in one place
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Notifications</p>
                <p className="text-2xl font-bold text-gray-900">3 New</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Payment</p>
                <p className="text-2xl font-bold text-gray-900">Mar 15</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Room Status</p>
                <p className="text-2xl font-bold text-gray-900">Assigned</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Wrench className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">2 Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {featureCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className={`bg-gradient-to-r ${card.color} p-4`}>
                  <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <div className="text-white">
                      {card.icon}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Room Search Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Find Available Rooms</h2>
            <p className="text-gray-600 mt-2">Search and filter through available accommodation options</p>
          </div>
          
          <div className="p-6">
            <div className="relative max-w-2xl mb-6">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by room number or type..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="md:hidden text-gray-500 hover:text-gray-700"
                    >
                      <Filter className="h-5 w-5" />
                    </button>
                  </div>
                  <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                    <RoomSearchFilter filters={filters} onFilterChange={handleFilterChange} />
                  </div>
                </div>
              </div>

              {/* Room Results */}
              <div className="flex-1">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map(room => (
                      <RoomCard
                        key={room._id}
                        room={room}
                        onApplyClick={() => handleApplyClick(room)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <div className="text-gray-500 text-lg font-medium">No rooms available</div>
                      <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ApplicationModal
          room={selectedRoom}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
}

export default StudentPortal; 