import React from 'react';
import { Users, DollarSign, CheckCircle, Building2, Moon, Users2, Edit, Trash2, UserPlus } from 'lucide-react';

function RoomCard({ room, onApplyClick, onAssignStudent, onEditRoom, onDeleteRoom, isAdmin = false }) {
  // Debug logging
  console.log('RoomCard received room data:', {
    roomNumber: room.roomNumber,
    features: room.features,
    floorLevel: room.floorLevel
  });

  const handleImageError = (e) => {
    e.target.src = `https://placehold.co/600x400/e2e8f0/1e293b?text=Room+${room.roomNumber}`;
  };

  const amenityIcons = {
    'Wi-Fi': '📶',
    'Air Conditioning': '❄️',
    'Study Desk': '📚',
    'Private Bathroom': '🚿',
    'Kitchen': '🍳',
    'Laundry': '👕',
    'TV': '📺',
    'Parking': '🅿️'
  };

  const floorLevelLabels = {
    'ground': 'Ground Floor',
    'low': 'Lower Floor',
    'mid': 'Middle Floor',
    'high': 'Upper Floor'
  };

  // Ensure features object exists with default values
  const features = {
    quietStudyArea: room.features?.quietStudyArea || false,
    preferredGender: room.features?.preferredGender || 'any'
  };

  // Get floor level with fallback
  const floorLevel = room.floorLevel || 'ground';
  const floorLevelLabel = floorLevelLabels[floorLevel] || 'Floor not specified';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative">
        <img
          src={room.image || `https://placehold.co/600x400/e2e8f0/1e293b?text=Room+${room.roomNumber}`}
          alt={`Room ${room.roomNumber}`}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
            Room {room.roomNumber}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 text-white text-sm font-medium rounded-full ${
            room.isAvailable ? 'bg-black' : 'bg-gray-500'
          }`}>
            {room.isAvailable ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {room.type} Room
            </h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">Capacity: {room.capacity}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Building2 className="h-4 w-4 mr-1" />
                <span className="text-sm">{floorLevelLabel}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-black font-bold">
              <DollarSign className="h-5 w-5" />
              {room.price}
            </div>
            <span className="text-sm text-gray-500">per semester</span>
          </div>
        </div>

        {/* Room Features */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Room Features</h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Users2 className="h-4 w-4 mr-2 text-black" />
              Gender Preference: {features.preferredGender === 'any' 
                ? 'No Preference' 
                : `${features.preferredGender.charAt(0).toUpperCase() + features.preferredGender.slice(1)} Only`}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Moon className="h-4 w-4 mr-2 text-black" />
              {features.quietStudyArea ? 'Quiet Study Area' : 'Standard Study Area'}
            </div>
          </div>
        </div>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  {amenityIcons[amenity] || '•'} {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Standard Features */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-black" />
            24/7 Security
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-black" />
            All utilities included
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-black" />
            Regular maintenance
          </div>
        </div>

        {/* Action Buttons */}
        {isAdmin ? (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onEditRoom(room)}
              className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => onAssignStudent(room)}
              className="flex items-center justify-center px-4 py-2 bg-white text-black border border-black rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assign
            </button>
            <button
              onClick={() => onDeleteRoom(room)}
              className="flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={() => onApplyClick(room)}
            className={`w-full py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
              room.isAvailable 
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!room.isAvailable}
          >
            {room.isAvailable ? 'Apply Now' : 'Not Available'}
          </button>
        )}
      </div>
    </div>
  );
}

export default RoomCard; 