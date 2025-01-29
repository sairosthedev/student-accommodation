import React, { useState, useEffect } from 'react';
import { fetchStudents, deleteStudent } from '../services/api';
import { Search, Trash2, Home, UserMinus } from 'lucide-react';
import Notification from './Notification';

const StudentList = ({ onSelectStudent }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'assigned', 'unassigned'
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const loadStudents = async () => {
    try {
      setError('');
      const { data } = await fetchStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch students');
      showNotification('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        await loadStudents(); // Refresh list
        showNotification('Student deleted successfully');
      } catch (err) {
        setError('Failed to delete student');
        showNotification('Failed to delete student', 'error');
      }
    }
  };

  const handleStudentSelect = (student) => {
    onSelectStudent(student);
    showNotification('Student assigned successfully');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'assigned' ? student.assignedRoom :
      filter === 'unassigned' ? !student.assignedRoom :
      true;

    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="text-center py-4">Loading students...</div>;

  return (
    <div className="space-y-4">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              filter === 'assigned'
                ? 'bg-blue-500 text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            Assigned
          </button>
          <button
            onClick={() => setFilter('unassigned')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              filter === 'unassigned'
                ? 'bg-blue-500 text-white'
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            Unassigned
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredStudents.map(student => (
          <div
            key={student._id}
            onClick={() => !student.assignedRoom && handleStudentSelect(student)}
            className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
              !student.assignedRoom ? 'cursor-pointer hover:bg-gray-50' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Home className={`h-4 w-4 ${student.assignedRoom ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className="text-sm text-gray-500">
                    {student.assignedRoom 
                      ? `Room ${student.assignedRoom.roomNumber}`
                      : 'Not assigned to a room'}
                  </p>
                </div>
                {student.phone && (
                  <p className="text-sm text-gray-500 mt-1">
                    Phone: {student.phone}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!student.assignedRoom ? (
                  <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                    Unassigned
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    Assigned
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStudent(student._id);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Delete student"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No students found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;