import React, { useState } from 'react';
import StudentList from '../components/StudentList';
import AddStudentForm from '../components/AddStudentForm';

export default function Students() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showAddForm ? 'Hide Form' : 'Add New Student'}
        </button>
      </div>

      {showAddForm && (
        <AddStudentForm
          onStudentAdded={() => {
            setShowAddForm(false);
            // Force StudentList to refresh
            setSelectedStudent(null);
          }}
        />
      )}

      <StudentList
        onSelectStudent={(student) => setSelectedStudent(student)}
      />
    </div>
  );
}