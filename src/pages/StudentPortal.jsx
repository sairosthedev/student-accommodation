import React, { useState, useEffect } from 'react';
import { fetchAvailableRooms, applyForRoom } from '../services/api';
import RoomSearchFilter from '../components/RoomSearchFilter';
import RoomCard from '../components/RoomCard';
import ApplicationModal from '../components/ApplicationModal';
import { Search, Bed, Home, DollarSign, Filter } from 'lucide-react';

function StudentPortal() {
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
        roomId: selectedRoom._id
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Student Room</h1>
          <p className="text-xl text-indigo-100 mb-8">
            Browse through our selection of comfortable and affordable student accommodations
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by room number or type..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Bed className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Available Rooms</h3>
                <p className="text-2xl font-bold text-indigo-600">{filteredRooms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Room Types</h3>
                <p className="text-2xl font-bold text-indigo-600">3</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Results */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
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
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                {error}
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
                <div className="col-span-2 text-center py-12 bg-white rounded-lg border border-gray-200">
                  <div className="text-gray-500 text-lg">No rooms available</div>
                  <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
                </div>
              )}
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