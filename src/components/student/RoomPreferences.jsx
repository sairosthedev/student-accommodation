import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '../../lib/utils';

const RoomPreferences = ({ initialPreferences = {}, readOnly = false, onSubmit = null, showForm = true }) => {
  const [preferences, setPreferences] = useState({
    floorLevel: initialPreferences.floorLevel || '',
    roommateGender: initialPreferences.roommateGender || '',
    quietStudyArea: initialPreferences.quietStudyArea || false,
    roomType: initialPreferences.roomType || '',
    studyHabits: initialPreferences.studyHabits || '',
    sleepSchedule: initialPreferences.sleepSchedule || '',
  });

  const toast = useToast();
  const isMobile = useIsMobile();

  const handleChange = (e) => {
    if (readOnly) return;
    const { name, value, type, checked } = e.target;
    const newPreferences = {
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    };
    setPreferences(newPreferences);
    if (onSubmit) {
      onSubmit(newPreferences);
    }
  };

  if (!showForm) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-1.5 md:space-y-2">
          <p className="text-xs md:text-sm text-gray-600">Floor Level</p>
          <p className="text-sm md:text-base font-medium text-gray-900">{preferences.floorLevel || 'Not set'}</p>
        </div>
        <div className="space-y-1.5 md:space-y-2">
          <p className="text-xs md:text-sm text-gray-600">Roommate Gender</p>
          <p className="text-sm md:text-base font-medium text-gray-900">{preferences.roommateGender || 'Not set'}</p>
        </div>
        <div className="space-y-1.5 md:space-y-2">
          <p className="text-xs md:text-sm text-gray-600">Room Type</p>
          <p className="text-sm md:text-base font-medium text-gray-900">{preferences.roomType || 'Not set'}</p>
        </div>
        <div className="space-y-1.5 md:space-y-2">
          <p className="text-xs md:text-sm text-gray-600">Study Habits</p>
          <p className="text-sm md:text-base font-medium text-gray-900">{preferences.studyHabits || 'Not set'}</p>
        </div>
        <div className="space-y-1.5 md:space-y-2">
          <p className="text-xs md:text-sm text-gray-600">Sleep Schedule</p>
          <p className="text-sm md:text-base font-medium text-gray-900">{preferences.sleepSchedule || 'Not set'}</p>
        </div>
        <div className="space-y-1.5 md:space-y-2">
          <p className="text-xs md:text-sm text-gray-600">Quiet Study Area</p>
          <p className="text-sm md:text-base font-medium text-gray-900">{preferences.quietStudyArea ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <FormControl>
            <FormLabel className={cn(
              "text-gray-700",
              isMobile ? "text-sm mb-1" : "mb-2"
            )}>Preferred Floor Level</FormLabel>
            <Select
              name="floorLevel"
              value={preferences.floorLevel}
              onChange={handleChange}
              placeholder="Select floor level"
              className={cn(
                "w-full rounded-lg border-gray-200 focus:border-black focus:ring-black",
                isMobile ? "text-sm h-10" : "h-11"
              )}
              isDisabled={readOnly}
            >
              <option value="ground">Ground Floor</option>
              <option value="low">Lower Floors (1-3)</option>
              <option value="mid">Middle Floors (4-6)</option>
              <option value="high">Higher Floors (7+)</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel className={cn(
              "text-gray-700",
              isMobile ? "text-sm mb-1" : "mb-2"
            )}>Roommate Gender Preference</FormLabel>
            <Select
              name="roommateGender"
              value={preferences.roommateGender}
              onChange={handleChange}
              placeholder="Select gender preference"
              className={cn(
                "w-full rounded-lg border-gray-200 focus:border-black focus:ring-black",
                isMobile ? "text-sm h-10" : "h-11"
              )}
              isDisabled={readOnly}
            >
              <option value="same">Same Gender</option>
              <option value="any">Any Gender</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel className={cn(
              "text-gray-700",
              isMobile ? "text-sm mb-1" : "mb-2"
            )}>Room Type</FormLabel>
            <Select
              name="roomType"
              value={preferences.roomType}
              onChange={handleChange}
              placeholder="Select room type"
              className={cn(
                "w-full rounded-lg border-gray-200 focus:border-black focus:ring-black",
                isMobile ? "text-sm h-10" : "h-11"
              )}
              isDisabled={readOnly}
            >
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="suite">Suite</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel className={cn(
              "text-gray-700",
              isMobile ? "text-sm mb-1" : "mb-2"
            )}>Study Habits</FormLabel>
            <Select
              name="studyHabits"
              value={preferences.studyHabits}
              onChange={handleChange}
              placeholder="Select study habits"
              className={cn(
                "w-full rounded-lg border-gray-200 focus:border-black focus:ring-black",
                isMobile ? "text-sm h-10" : "h-11"
              )}
              isDisabled={readOnly}
            >
              <option value="early">Early Bird (Study in Morning)</option>
              <option value="night">Night Owl (Study at Night)</option>
              <option value="mixed">Mixed Schedule</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel className={cn(
              "text-gray-700",
              isMobile ? "text-sm mb-1" : "mb-2"
            )}>Sleep Schedule</FormLabel>
            <Select
              name="sleepSchedule"
              value={preferences.sleepSchedule}
              onChange={handleChange}
              placeholder="Select sleep schedule"
              className={cn(
                "w-full rounded-lg border-gray-200 focus:border-black focus:ring-black",
                isMobile ? "text-sm h-10" : "h-11"
              )}
              isDisabled={readOnly}
            >
              <option value="early">Early (Before 10 PM)</option>
              <option value="medium">Medium (10 PM - 12 AM)</option>
              <option value="late">Late (After 12 AM)</option>
            </Select>
          </FormControl>

          <FormControl>
            <div className={cn(
              "flex items-center space-x-3 bg-gray-50 rounded-lg",
              isMobile ? "p-3" : "p-4"
            )}>
              <div className="flex-1">
                <FormLabel className={cn(
                  "text-gray-700 mb-0",
                  isMobile && "text-sm"
                )}>Quiet Study Area</FormLabel>
                <p className={cn(
                  "text-gray-500",
                  isMobile ? "text-xs" : "text-sm"
                )}>Prefer a quiet environment for studying</p>
              </div>
              <Checkbox
                name="quietStudyArea"
                isChecked={preferences.quietStudyArea}
                onChange={handleChange}
                colorScheme="gray"
                isDisabled={readOnly}
                className={cn(
                  "min-w-[1.25rem]",
                  isMobile && "transform scale-90"
                )}
              />
            </div>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default RoomPreferences; 