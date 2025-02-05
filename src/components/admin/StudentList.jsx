import React, { useState, useEffect } from 'react';
import { fetchStudents, deleteStudent, unassignRoom } from '../../services/api';
import { 
  Search, 
  Trash2, 
  Home, 
  UserMinus, 
  Filter,
  Plus,
  Mail,
  Phone,
  GraduationCap,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';
import Notification from '../common/Notification';

const StudentList = ({ onSelectStudent, onAddStudent }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
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

  const handleUnassignRoom = async (student) => {
    // For older records, student.assignedRoom might be just the ID
    // For newer records, it will be an object with _id and roomNumber
    const roomId = student.assignedRoom?._id || student.assignedRoom;
    const roomNumber = student.assignedRoom?.roomNumber || 'their current room';
    
    if (!roomId) {
      console.error('No room ID found for student:', student);
      showNotification('Cannot unassign student - no room ID found', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to unassign ${student.name} from ${roomNumber}?`)) {
      try {
        console.log('Unassigning student:', {
          studentId: student._id,
          roomId: roomId,
          assignedRoom: student.assignedRoom,
          student: student
        });
        
        // Convert ObjectId to string if needed
        const roomIdStr = typeof roomId === 'object' ? roomId.toString() : roomId;
        const studentIdStr = typeof student._id === 'object' ? student._id.toString() : student._id;
        
        await unassignRoom(roomIdStr, studentIdStr);
        await loadStudents(); // Refresh list
        showNotification('Student unassigned successfully');
      } catch (err) {
        console.error('Unassign error:', err);
        const errorMessage = err.response?.data?.error || err.message;
        setError('Failed to unassign student: ' + errorMessage);
        showNotification('Failed to unassign student: ' + errorMessage, 'error');
      }
    }
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

  const getStatusColor = (student) => {
    return student.assignedRoom 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (student) => {
    return student.assignedRoom ? 'Assigned' : 'Unassigned';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(student => student.assignedRoom).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <UserX className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unassigned</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(student => !student.assignedRoom).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <GraduationCap className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Programs</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(students.map(s => s.program)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-black"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <button className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <span>Filter</span>
              </button>
            </div>
            <div className="flex gap-2">
              {['all', 'assigned', 'unassigned'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    filter === filterOption
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
            <button
              onClick={onAddStudent}
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-7 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600">
          <div className="col-span-2">Student</div>
          <div>Status</div>
          <div>Room</div>
          <div>Program</div>
          <div>Contact</div>
          <div>Actions</div>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-gray-100">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 hover:bg-gray-50 transition-colors items-center"
            >
              <div className="col-span-2">
                <h3 className="font-medium text-gray-900">{student.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student)}`}>
                  {getStatusText(student)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {student.assignedRoom?.roomNumber || 'Not assigned'}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {student.program}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {student.phone || 'N/A'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteStudent(student._id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                  title="Delete Student"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                {student.assignedRoom ? (
                  <button
                    onClick={() => handleUnassignRoom(student)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                  >
                    Unassign
                  </button>
                ) : (
                  <button
                    onClick={() => handleStudentSelect(student)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 text-sm"
                  >
                    Assign Room
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No students found</div>
              <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;