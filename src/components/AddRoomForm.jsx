import React, { useState } from 'react';
import { addRoom } from '../services/api';
import Notification from './Notification';

const AddRoomForm = ({ onRoomAdded }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'single', // single, double, suite
    price: '',
    capacity: 1,
    amenities: '',
    image: '',
    isAvailable: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Convert amenities string to array and clean it
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
        amenities: '',
        image: '',
        isAvailable: true
      });
      if (onRoomAdded) onRoomAdded();
      showNotification('Room added successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add room');
      showNotification('Failed to add room', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Room Number
          </label>
          <input
            type="text"
            id="roomNumber"
            value={formData.roomNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="e.g., A101"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Room Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="single">Single Room</option>
            <option value="double">Double Room</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price per Semester ($)
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter price per semester"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 mb-1">
            Amenities
          </label>
          <input
            type="text"
            id="amenities"
            value={formData.amenities}
            onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amenities separated by commas (e.g., Wi-Fi, Air Conditioning, Study Desk)"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image URL (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {loading ? 'Adding...' : 'Add Room'}
        </button>
      </form>
    </div>
  );
};

export default AddRoomForm; 