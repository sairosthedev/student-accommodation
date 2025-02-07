import React, { useState } from 'react';
import axios from 'axios';
import { useIsMobile } from '../../hooks/use-mobile';

const AddStudent = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
  });
  const isMobile = useIsMobile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/students', formData);
      setFormData({ name: '', email: '', phone: '', roomNumber: '' }); // Reset form
      if (onStudentAdded) onStudentAdded();
      alert('Student added successfully!');
    } catch (error) {
      console.error(error);
      alert('Error adding student. Please try again.');
    }
  };

  return (
    <div className={`bg-white shadow-md rounded-lg ${isMobile ? 'p-4' : 'p-6'}`}>
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-800 mb-4`}>Add New Student</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            id="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
          />
        </div>
        
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
          <input
            type="text"
            id="roomNumber"
            placeholder="Room Number"
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
          />
        </div>

        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${isMobile ? 'mt-4' : 'mt-6'}`}
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;