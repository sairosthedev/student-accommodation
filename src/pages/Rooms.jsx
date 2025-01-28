import React from 'react';

import { useState, useEffect } from 'react';
import RoomList from '../components/RoomList';
import AddRoomForm from '../components/AddRoomForm';
import { getRooms, assignStudentToRoom } from '../services/api';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
  
    const handleAssignStudent = async (roomId, studentId) => {
      try {
        setError(null);
        await assignStudentToRoom(roomId, studentId);
        // Refresh rooms after assignment
        const { data } = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error('Error assigning student:', error);
        setError(
          error.response?.data?.error || 
          'Failed to assign student. Please check if the backend server is running.'
        );
      }
    };
  
    const fetchRooms = async () => {
      try {
        setError(null);
        const { data } = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        let errorMessage = 'Error fetching rooms. ';
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          errorMessage += 'Please check if the backend server is running at http://localhost:5000';
        } else {
          errorMessage += error.response?.data?.error || error.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchRooms();
    }, []);
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Room Management</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showAddForm ? 'Hide Form' : 'Add New Room'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
            {error}
          </div>
        )}

        {showAddForm && <AddRoomForm onRoomAdded={fetchRooms} />}

        {loading ? (
          <div className="text-center py-8">
            <p>Loading rooms...</p>
          </div>
        ) : (
          <RoomList rooms={rooms} onAssignStudent={handleAssignStudent} />
        )}
      </div>
    );
  }