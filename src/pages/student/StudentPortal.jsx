import React, { useState, useEffect } from 'react';
import { fetchAvailableRooms, applyForRoom, fetchStudentRoomDetails } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import RoomSearchFilter from '../../components/common/RoomSearchFilter';
import RoomCard from '../../components/common/RoomCard';
import ApplicationModal from '../../components/student/ApplicationModal';
import {
  Search,
  Bell,
  Calendar,
  Users,
  Wrench,
  CreditCard,
  MessageSquare,
  Filter,
} from 'lucide-react'; //hhh

function StudentPortal() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [studentRoom, setStudentRoom] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
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
  const [dashboardStats, setDashboardStats] = useState({
    notifications: 0,
    nextPaymentDate: null,
    maintenanceRequests: 0,
    roomStatus: 'Not Assigned'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadRooms(),
        loadStudentRoomDetails(),
        loadDashboardStats()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      // Fetch maintenance requests count
      const maintenanceResponse = await fetch(`http://localhost:5000/api/maintenance/user/count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const maintenanceData = await maintenanceResponse.json();

      // Fetch notifications count
      const notificationsResponse = await fetch(`http://localhost:5000/api/notifications/unread/count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const notificationsData = await notificationsResponse.json();

      // Fetch payment info
      const paymentResponse = await fetch(`http://localhost:5000/api/payments/next`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const paymentData = await paymentResponse.json();

      setDashboardStats({
        notifications: notificationsData.count || 0,
        nextPaymentDate: paymentData.nextPaymentDate || 'No payment due',
        maintenanceRequests: maintenanceData.count || 0,
        roomStatus: studentRoom ? 'Assigned' : 'Not Assigned'
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadRooms = async () => {
    try {
      const response = await fetchAvailableRooms();
      console.log('Available rooms response:', response);
      setRooms(response || []);
      setFilteredRooms(response || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError('Failed to load available rooms. Please try again later.');
      setRooms([]);
      setFilteredRooms([]);
    }
  };

  const loadStudentRoomDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.studentId) {
        const response = await fetchStudentRoomDetails(user.studentId);
        if (response && response.roomNumber) {
          setStudentRoom(response);
          setStudentInfo(user);
        }
      }
    } catch (error) {
      console.error('Error loading student room details:', error);
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
      value: `${dashboardStats.notifications} New`,
      icon: <Bell className="h-6 w-6 text-gray-600" />,
    },
    {
      title: 'Next Payment',
      value: dashboardStats.nextPaymentDate,
      icon: <Calendar className="h-6 w-6 text-gray-600" />,
    },
    {
      title: 'Room Status',
      value: dashboardStats.roomStatus,
      icon: <Users className="h-6 w-6 text-gray-600" />,
    },
    {
      title: 'Maintenance',
      value: `${dashboardStats.maintenanceRequests} Active`,
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
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Student Portal</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Welcome back, {studentInfo ? `${studentInfo.firstName} ${studentInfo.lastName}` : 'Student'}
            </p>
          </div>
        </div>

        {/* Student Room Details */}
        {studentRoom && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Room Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Room Number</p>
                <p className="text-base sm:text-lg font-semibold">{studentRoom.roomNumber}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Room Type</p>
                <p className="text-base sm:text-lg font-semibold">{studentRoom.type}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Monthly Rent</p>
                <p className="text-base sm:text-lg font-semibold">${studentRoom.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="group bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`${feature.bgColor} p-2 sm:p-3 rounded-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Room Search Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Available Rooms</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Find and apply for available accommodation</p>
          </div>

          <div className="p-4 sm:p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => handleFilterChange({ ...filters, searchTerm: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-black focus:ring-black"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                >
                  <Filter className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600 mr-2" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <RoomSearchFilter filters={filters} onFilterChange={handleFilterChange} />
              </div>
            )}

            {/* Room Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    onApplyClick={() => setSelectedRoom(room)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500 text-base sm:text-lg font-medium">No rooms found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
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