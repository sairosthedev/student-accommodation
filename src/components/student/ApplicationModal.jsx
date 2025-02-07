import React, { useState } from 'react';
import RoomPreferences from './RoomPreferences';
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '../../lib/utils';

function ApplicationModal({ room, isOpen, onClose, onSubmit }) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    program: '',
    yearOfStudy: '',
    specialRequirements: '',
    preferences: {
      floorLevel: '',
      roommateGender: '',
      quietStudyArea: false,
      roomType: '',
      studyHabits: '',
      sleepSchedule: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferencesSubmit = (preferences) => {
    setFormData(prev => ({
      ...prev,
      preferences
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className={cn(
        "relative mx-auto my-8 p-4 md:p-8 border w-full shadow-lg rounded-lg bg-white",
        isMobile ? "max-w-full min-h-screen my-0" : "max-w-7xl min-h-screen"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={cn(
            "font-bold text-gray-900",
            isMobile ? "text-xl" : "text-2xl"
          )}>
            Apply for Room {room.number}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2"
          >
            <svg className={cn(
              "fill-none viewBox='0 0 24 24' stroke='currentColor'",
              isMobile ? "h-6 w-6" : "h-8 w-8"
            )}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className={cn(
            "grid gap-6 md:gap-8",
            isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2",
            "min-h-[calc(100vh-200px)]"
          )}>
            {/* Personal Information Section */}
            <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm h-full">
              <h4 className={cn(
                "font-semibold text-gray-900 mb-6",
                isMobile ? "text-lg" : "text-xl"
              )}>Personal Information</h4>
              <div className="space-y-4 md:space-y-6">
                <div className={cn(
                  "grid gap-4 md:gap-6",
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                )}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                    <option value="5+">Fifth Year or Above</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Any special requirements or preferences..."
                  />
                </div>
              </div>
            </div>

            {/* Room Preferences Section */}
            <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm h-full">
              <h4 className={cn(
                "font-semibold text-gray-900 mb-6",
                isMobile ? "text-lg" : "text-xl"
              )}>Room Preferences</h4>
              <div className="preferences-container h-full">
                <RoomPreferences
                  initialPreferences={formData.preferences}
                  onSubmit={handlePreferencesSubmit}
                  showForm={true}
                  readOnly={false}
                />
              </div>
            </div>
          </div>

          <div className={cn(
            "flex border-t border-gray-200 pt-6",
            isMobile ? "flex-col space-y-3" : "flex-row justify-end space-x-4"
          )}>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 text-base font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
                isMobile && "w-full"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 text-base font-medium rounded-lg bg-black text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
                isMobile && "w-full"
              )}
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationModal; 