import React, { useState } from 'react';
import { addRoom } from '../../services/api';
import { Loader2, Building2, MapPin, School, BedDouble, Settings, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddRoomForm = ({ onRoomAdded }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'single',
    price: '',
    capacity: 1,
    location: 'Mount Pleasant',
    nearbyUniversities: [],
    distanceToUniversity: '',
    floorLevel: 'ground',
    floor: '',
    size: '',
    description: '',
    facilities: [],
    amenities: [],
    propertyAmenities: [],
    features: {
      quietStudyArea: false,
      preferredGender: 'any'
    },
    building: {
      name: '',
      location: '',
      wardenName: '',
      emergencyContact: ''
    },
    checkInTime: '',
    leaseStart: '',
    securityDeposit: '',
    rules: [],
    image: '',
    isAvailable: true
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const locations = [
    'Mount Pleasant',
    'Avondale',
    'Hatfield',
    'Belvedere',
    'Msasa',
    'Eastlea',
    'Milton Park',
    'Marlborough',
    'Greendale'
  ];

  const universities = [
    'University of Zimbabwe',
    'Harare Institute of Technology',
    'Women\'s University in Africa',
    'Catholic University in Zimbabwe',
    'Zimbabwe Open University',
    'Africa University'
  ];

  const propertyAmenitiesList = [
    'High-speed WiFi',
    'Study Areas',
    'Security System',
    'Laundry Facilities',
    'Bike Storage',
    'Common Room',
    'Parking',
    'Garden',
    'CCTV',
    'Generator Backup'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (e.g., features.quietStudyArea)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInput = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  const handleMultiSelect = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.roomNumber || !formData.type || !formData.price || !formData.capacity || 
          !formData.location || !formData.distanceToUniversity || !formData.floorLevel) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.nearbyUniversities.length === 0) {
        throw new Error('Please select at least one nearby university');
      }

      const response = await addRoom(formData);
      toast.success('Room successfully added!');
      if (onRoomAdded) onRoomAdded();
      
      // Reset form
      setFormData({
        roomNumber: '',
        type: 'single',
        price: '',
        capacity: 1,
        location: 'Mount Pleasant',
        nearbyUniversities: [],
        distanceToUniversity: '',
        floorLevel: 'ground',
        floor: '',
        size: '',
        description: '',
        facilities: [],
        amenities: [],
        propertyAmenities: [],
        features: {
          quietStudyArea: false,
          preferredGender: 'any'
        },
        building: {
          name: '',
          location: '',
          wardenName: '',
          emergencyContact: ''
        },
        checkInTime: '',
        leaseStart: '',
        securityDeposit: '',
        rules: [],
        image: '',
        isAvailable: true
      });
    } catch (err) {
      setError(err.message || 'Failed to add room');
      toast.error(err.message || 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Add New Room</h2>
        <p className="text-blue-100 mt-2">Fill in the details below to add a new room to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-lg">
        <div className="p-6 md:p-8 space-y-8">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BedDouble className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                  placeholder="e.g., A101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                >
                  <option value="single">Single Room</option>
                  <option value="double">Double Room</option>
                  <option value="suite">Suite</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Location Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance to University *</label>
                <input
                  type="text"
                  name="distanceToUniversity"
                  value={formData.distanceToUniversity}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 minutes walk"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Universities *</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {universities.map(uni => (
                      <label key={uni} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.nearbyUniversities.includes(uni)}
                          onChange={(e) => {
                            const newUniversities = e.target.checked
                              ? [...formData.nearbyUniversities, uni]
                              : formData.nearbyUniversities.filter(u => u !== uni);
                            setFormData(prev => ({
                              ...prev,
                              nearbyUniversities: newUniversities
                            }));
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{uni}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Additional Features</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Amenities</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    {propertyAmenitiesList.map(amenity => (
                      <label key={amenity} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.propertyAmenities.includes(amenity)}
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...formData.propertyAmenities, amenity]
                              : formData.propertyAmenities.filter(a => a !== amenity);
                            setFormData(prev => ({
                              ...prev,
                              propertyAmenities: newAmenities
                            }));
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Features</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <label className="inline-flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="features.quietStudyArea"
                      checked={formData.features.quietStudyArea}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Quiet Study Area</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Gender</label>
                    <select
                      name="features.preferredGender"
                      value={formData.features.preferredGender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    >
                      <option value="any">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Rules</label>
                <textarea
                  name="rules"
                  value={formData.rules.join('\n')}
                  onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value.split('\n').filter(Boolean) }))}
                  placeholder="Enter each rule on a new line&#10;e.g.,&#10;No smoking&#10;Quiet hours: 10 PM - 6 AM&#10;No pets allowed"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Building Information */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Building Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Building Name</label>
                <input
                  type="text"
                  name="building.name"
                  value={formData.building.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                  placeholder="e.g., Block A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warden Name</label>
                <input
                  type="text"
                  name="building.wardenName"
                  value={formData.building.wardenName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                  placeholder="e.g., John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="building.emergencyContact"
                  value={formData.building.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200"
                  placeholder="e.g., +263 123 456 789"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 md:px-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="px-6 md:px-8 py-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Adding Room...
              </>
            ) : (
              'Add Room'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoomForm;