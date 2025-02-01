import React, { useState, useEffect } from 'react';
import { fetchAvailableRooms, applyForRoom } from '../services/api';
import { useNavigate } from 'react-router-dom';
import RoomSearchFilter from '../components/RoomSearchFilter';
import RoomCard from '../components/RoomCard';
import ApplicationModal from '../components/ApplicationModal';
import {
  Search,
  Bell,
  Calendar,
  Users,
  Wrench,
  CreditCard,
  MessageSquare,
  Filter,
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
      setRooms(response.data || []);
      setFilteredRooms(response.data || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError('Failed to load available rooms. Please try again later.');
      setRooms([]);
      setFilteredRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      console.log('Submitting application with data:', {
        ...applicationData,
        roomId: selectedRoom._id
      });
      
      const response = await applyForRoom({
        ...applicationData,
        roomId: selectedRoom._id
      });
      
      if (response.data) {
        // Close the modal and show success message
        setSelectedRoom(null);
        alert('Application submitted successfully!');
        // Optionally refresh the rooms list
        loadRooms();
      } else {
        console.error('Application submission failed:', response);
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data
      });
      alert(error.response?.data?.error || 'An error occurred while submitting your application. Please try again.');
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

  const quickStats = [
    {
      title: 'Notifications',
      value: '3 New',
      icon: <Bell className="h-6 w-6 text-gray-600" />,
      trend: 'up'
    },
    {
      title: 'Next Payment',
      value: 'Mar 15',
      icon: <Calendar className="h-6 w-6 text-gray-600" />,
    },
    {
      title: 'Room Status',
      value: 'Assigned',
      icon: <Users className="h-6 w-6 text-gray-600" />,
    },
    {
      title: 'Maintenance',
      value: '2 Active',
      icon: <Wrench className="h-6 w-6 text-gray-600" />,
    }
  ];

  const features = [
    {
      title: 'Maintenance',
      description: 'Submit and track maintenance requests',
      icon: <Wrench className="h-6 w-6" />,
      path: '/student/maintenance',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Payments',
      description: 'Manage your payments and view history',
      icon: <CreditCard className="h-6 w-6" />,
      path: '/student/payments',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Communication',
      description: 'Stay connected with admin and students',
      icon: <MessageSquare className="h-6 w-6" />,
      path: '/student/communication',
      bgColor: 'bg-pink-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Welcome Back, Student
              </h1>
              <p className="mt-4 text-xl text-gray-300">
                Your student housing dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="group cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center p-4">
                <div className={`${feature.bgColor} w-10 h-10 rounded-lg flex items-center justify-center mr-4`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Room Search Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
            <p className="mt-2 text-gray-600">Find and apply for available accommodation</p>
          </div>

          <div className="p-6">
            {/* Search and Filter Bar */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="md:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full md:w-auto px-4 py-3 bg-gray-100 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
              
              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <RoomSearchFilter filters={filters} onFilterChange={handleFilterChange} />
                </div>
              )}
            </div>

            {/* Room Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    onApplyClick={() => setSelectedRoom(room)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg font-medium">No rooms found</p>
                  <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedRoom && (
        <ApplicationModal
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
}

export default StudentPortal;