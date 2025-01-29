import React from 'react';
import { Users, DollarSign, CheckCircle } from 'lucide-react';

function RoomCard({ room, onApplyClick }) {
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
          <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
            Room {room.roomNumber}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
            Available
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
            <div className="flex items-center mt-1 text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">Capacity: {room.capacity}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-indigo-600 font-bold">
              <DollarSign className="h-5 w-5" />
              {room.price}
            </div>
            <span className="text-sm text-gray-500">per semester</span>
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

        {/* Features */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            24/7 Security
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            All utilities included
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            Regular maintenance
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => onApplyClick(room)}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default RoomCard; 