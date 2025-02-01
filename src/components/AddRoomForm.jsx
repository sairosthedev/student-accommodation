import React, { useState } from 'react';
import { addRoom } from '../services/api';
import { Loader2 } from 'lucide-react';

const AddRoomForm = ({ onRoomAdded }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'single',
    price: '',
    capacity: 1,
    floorLevel: 'ground',
    amenities: '',
    features: {
      quietStudyArea: false,
      preferredGender: 'any'
    },
    image: '',
    isAvailable: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const processedData = {
      ...formData,
      amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean),
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity)
    };

    try {
      await addRoom(processedData);
      setFormData({
        roomNumber: '',
        type: 'single',
        price: '',
        capacity: 1,
        floorLevel: 'ground',
        amenities: '',
        features: {
          quietStudyArea: false,
          preferredGender: 'any'
        },
        image: '',
        isAvailable: true
      });
      if (onRoomAdded) onRoomAdded();
      showNotification('Room successfully added!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add room');
      showNotification('Failed to add room', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Room</h2>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'error' 
              ? 'bg-gray-100 text-gray-900 border border-gray-300'
              : 'bg-gray-100 text-gray-900 border border-gray-300'
          }`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Room Number</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                placeholder="e.g., A101"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="suite">Suite</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Floor Level</label>
              <select
                value={formData.floorLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, floorLevel: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="ground">Ground Floor</option>
                <option value="low">Low Floor</option>
                <option value="mid">Mid Floor</option>
                <option value="high">High Floor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price per Semester ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter price"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  capacity: parseInt(e.target.value) 
                }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amenities</label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
                placeholder="WiFi, AC, Study Desk..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Room Features</h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Preferred Gender</label>
              <select
                value={formData.features.preferredGender}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  features: { ...prev.features, preferredGender: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="any">Any Gender</option>
                <option value="male">Male Only</option>
                <option value="female">Female Only</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="quietStudyArea"
                checked={formData.features.quietStudyArea}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  features: { ...prev.features, quietStudyArea: e.target.checked }
                }))}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="quietStudyArea" className="text-sm font-medium text-gray-700">
                Quiet Study Area
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="Enter image URL (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Adding Room...
              </div>
            ) : (
              'Add Room'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoomForm;