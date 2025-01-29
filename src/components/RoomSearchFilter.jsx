import React from 'react';
import { Slider } from '@mui/material';

function RoomSearchFilter({ filters, onFilterChange }) {
  const handlePriceChange = (event, newValue) => {
    onFilterChange({
      ...filters,
      priceRange: newValue
    });
  };

  const handleTypeChange = (event) => {
    onFilterChange({
      ...filters,
      roomType: event.target.value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filter Rooms</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range ($)
        </label>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={100}
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Type
        </label>
        <select
          value={filters.roomType}
          onChange={handleTypeChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="single">Single Room</option>
          <option value="double">Double Room</option>
          <option value="suite">Suite</option>
        </select>
      </div>
    </div>
  );
}

export default RoomSearchFilter; 