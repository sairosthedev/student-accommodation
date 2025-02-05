import React, { useState, useEffect } from 'react';
import { fetchStudentRoomDetails } from '../../services/api';
import { 
  Home,
  Users,
  DoorClosed,
  Building,
  MapPin,
  Wifi,
  Tv,
  Wind,
  Thermometer,
  ShowerHead,
  BedDouble,
  Calendar,
  Clock,
  Shield,
  Plug,
  BookOpen,
  Coffee,
  Utensils,
  Car,
  Warehouse,
  Phone
} from 'lucide-react';

function MyRoom() {
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRoomDetails();
  }, []);

  const loadRoomDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Current user:', user);

      if (!user || !user.studentId) {
        setError('No user found. Please log in again.');
        return;
      }

      const userId = user.studentId; 

      console.log('Fetching room details for user:', userId);
      const response = await fetchStudentRoomDetails(userId);
      console.log('Room details response:', response);
      
      if (response?.data) {
        setRoomDetails(response.data);
      } else {
        setError('NO_ROOM');
      }
    } catch (error) {
      console.error('Error in loadRoomDetails:', error);
      setError('Failed to load room details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debug logs for component state
  console.log('Component State:', { loading, error, roomDetails });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="ml-3 text-gray-600">Loading room details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="text-center">
            {error === 'NO_ROOM' ? (
              <>
                <Home className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Student Housing!</h2>
                <p className="text-gray-600 mb-6">
                  Looks like you haven't been assigned a room yet. Don't worry - this is normal if you:
                </p>
                <ul className="text-gray-600 mb-6 space-y-2">
                  <li>• Just submitted your housing application</li>
                  <li>• Are waiting for room allocation</li>
                  <li>• Haven't completed your registration</li>
                </ul>
                <p className="text-gray-600">
                  Please visit the accommodation office or contact housing support for assistance with your room assignment.
                </p>
              </>
            ) : (
              <>
                <DoorClosed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-4">
                  We're having trouble loading your room details at the moment. This might be due to a temporary connection issue.
                </p>
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">
                    Don't worry! You can try these steps:
                    <br />1. Check your internet connection
                    <br />2. Refresh the page
                    <br />3. Try again using the button below
                  </p>
                  <button 
                    onClick={loadRoomDetails}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refresh Room Details
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!roomDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="text-center">
            <DoorClosed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Room Assigned</h2>
            <p className="text-gray-600">You currently don't have a room assigned. Please contact the administrator.</p>
          </div>
        </div>
      </div>
    );
  }

  const amenities = [
    { name: 'Wi-Fi', icon: <Wifi className="h-5 w-5" />, available: roomDetails.facilities?.includes('wifi') },
    { name: 'TV', icon: <Tv className="h-5 w-5" />, available: roomDetails.facilities?.includes('tv') },
    { name: 'AC', icon: <Wind className="h-5 w-5" />, available: roomDetails.facilities?.includes('ac') },
    { name: 'Heating', icon: <Thermometer className="h-5 w-5" />, available: roomDetails.facilities?.includes('heating') },
    { name: 'Private Bathroom', icon: <ShowerHead className="h-5 w-5" />, available: roomDetails.facilities?.includes('private_bathroom') },
    { name: 'Double Bed', icon: <BedDouble className="h-5 w-5" />, available: roomDetails.facilities?.includes('double_bed') },
    { name: 'Study Area', icon: <BookOpen className="h-5 w-5" />, available: roomDetails.facilities?.includes('study_area') },
    { name: 'Power Backup', icon: <Plug className="h-5 w-5" />, available: roomDetails.facilities?.includes('power_backup') }
  ];

  const buildingAmenities = [
    { name: 'Cafeteria', icon: <Coffee className="h-5 w-5" />, available: roomDetails.building?.facilities?.includes('cafeteria') },
    { name: 'Kitchen', icon: <Utensils className="h-5 w-5" />, available: roomDetails.building?.facilities?.includes('kitchen') },
    { name: 'Parking', icon: <Car className="h-5 w-5" />, available: roomDetails.building?.facilities?.includes('parking') },
    { name: 'Storage', icon: <Warehouse className="h-5 w-5" />, available: roomDetails.building?.facilities?.includes('storage') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Room</h1>
          <p className="text-gray-600 mt-2">View your room details and amenities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Room Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Check-in Time</p>
                  <p className="text-lg font-semibold">{roomDetails.checkInTime || '2:00 PM'}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Lease Start</p>
                  <p className="text-lg font-semibold">{roomDetails.leaseStart || 'Jan 1, 2024'}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Security Deposit</p>
                  <p className="text-lg font-semibold">${roomDetails.securityDeposit || '500'}</p>
                </div>
              </div>
            </div>

            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Home className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Room Details</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Room Number</p>
                      <p className="text-lg font-medium">{roomDetails.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="text-lg font-medium">{roomDetails.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Floor</p>
                      <p className="text-lg font-medium">{roomDetails.floor || '1st Floor'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Size</p>
                      <p className="text-lg font-medium">{roomDetails.size || '200 sq ft'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Rent</p>
                      <p className="text-lg font-medium">${roomDetails.price}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Building className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Building Info</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Building Name</p>
                      <p className="text-lg font-medium">{roomDetails.building?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-lg font-medium">{roomDetails.building?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Warden Name</p>
                      <p className="text-lg font-medium">{roomDetails.building?.wardenName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Emergency Contact</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-lg font-medium">{roomDetails.building?.emergencyContact || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Description & Rules</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Room Description</h3>
                  <p className="text-gray-600">{roomDetails.description || 'No description available.'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Rules & Guidelines</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Quiet hours: 10 PM - 6 AM</li>
                    <li>No smoking inside the building</li>
                    <li>Visitors allowed: 8 AM - 8 PM</li>
                    <li>Keep common areas clean</li>
                    {roomDetails.rules?.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Room Amenities Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Room Amenities</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      amenity.available ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
                      {amenity.icon}
                    </div>
                    <span className={`font-medium ${
                      amenity.available ? 'text-green-900' : 'text-gray-500'
                    }`}>
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Building Amenities Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Building className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Building Amenities</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {buildingAmenities.map((amenity, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      amenity.available ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`${amenity.available ? 'text-green-600' : 'text-gray-400'}`}>
                      {amenity.icon}
                    </div>
                    <span className={`font-medium ${
                      amenity.available ? 'text-green-900' : 'text-gray-500'
                    }`}>
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyRoom; 
