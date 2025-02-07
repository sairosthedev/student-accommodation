import React, { useState } from 'react';
import { addStudent } from '../../services/api';
import Notification from '../common/Notification';

const AddStudentForm = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    program: '',
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

    try {
      await addStudent(formData);
      setFormData({ studentId: '', name: '', email: '', phone: '', program: '' });
      showNotification('Student added successfully');
      if (onStudentAdded) onStudentAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student');
      showNotification('Failed to add student', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Add New Student</h2>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-3 sm:mb-4 text-red-700 text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            value={formData.studentId}
            onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter student ID"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter student's full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter student's email"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter student's phone number"
            pattern="[0-9+\-\s]+"
            title="Please enter a valid phone number"
          />
        </div>

        <div>
          <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
            Program
          </label>
          <input
            type="text"
            id="program"
            value={formData.program}
            onChange={(e) => setFormData(prev => ({ ...prev, program: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter student's program"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm; 