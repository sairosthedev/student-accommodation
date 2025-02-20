const mongoose = require('mongoose');
const Room = require('../models/Room');

// Configuration for MongoDB connection
const MONGODB_URI = 'mongodb+srv://macdonaldsairos24:knWZgSjmHkQnLVwW@studentaccomodation.gazht.mongodb.net/?retryWrites=true&w=majority&appName=studentaccomodation';

// Helper function to get random element from array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random number between min and max (inclusive)
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to get random boolean
const getRandomBoolean = () => Math.random() < 0.5;

// Available options for room properties
const roomOptions = {
  locations: [
    'Mount Pleasant',
    'Avondale',
    'Hatfield',
    'Belvedere',
    'Msasa',
    'Eastlea',
    'Milton Park',
    'Marlborough',
    'Greendale'
  ],
  types: ['single', 'double', 'suite', 'apartment'],
  floorLevels: ['ground', 'low', 'mid', 'high'],
  universities: [
    'University of Zimbabwe',
    'Harare Institute of Technology',
    'Women\'s University in Africa',
    'Catholic University in Zimbabwe',
    'Zimbabwe Open University',
    'Africa University'
  ],
  propertyAmenities: [
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
  ],
  amenities: [
    'Air Conditioning',
    'Private Bathroom',
    'Study Desk',
    'Wardrobe',
    'Mini Fridge',
    'TV',
    'Microwave',
    'Bed with Storage',
    'Reading Lamp',
    'Curtains/Blinds'
  ],
  facilities: [
    'Shared Kitchen',
    'Common Room',
    'Study Room',
    'Laundry Room',
    'Gym',
    'Parking',
    'Garden',
    'BBQ Area',
    'Bicycle Storage',
    'Security Office'
  ],
  rules: [
    'No smoking',
    'No pets',
    'Quiet hours 10 PM - 6 AM',
    'No overnight guests',
    'Keep common areas clean',
    'No parties without permission',
    'Proper waste disposal',
    'No alterations to room',
    'Regular room inspections',
    'Report maintenance issues promptly'
  ]
};

// Function to generate random room data
const generateRandomRoom = (index) => {
  const roomType = getRandomElement(roomOptions.types);
  const capacity = roomType === 'single' ? 1 : 
                   roomType === 'double' ? 2 :
                   roomType === 'suite' ? 3 : 4;
  
  const location = getRandomElement(roomOptions.locations);
  const nearbyUnivCount = getRandomNumber(1, 3);
  const nearbyUniversities = [];
  while (nearbyUniversities.length < nearbyUnivCount) {
    const univ = getRandomElement(roomOptions.universities);
    if (!nearbyUniversities.includes(univ)) {
      nearbyUniversities.push(univ);
    }
  }

  // Generate random amenities (3-7 items)
  const amenityCount = getRandomNumber(3, 7);
  const amenities = [];
  while (amenities.length < amenityCount) {
    const amenity = getRandomElement(roomOptions.amenities);
    if (!amenities.includes(amenity)) {
      amenities.push(amenity);
    }
  }

  // Generate random property amenities (4-8 items)
  const propAmenityCount = getRandomNumber(4, 8);
  const propertyAmenities = [];
  while (propertyAmenities.length < propAmenityCount) {
    const amenity = getRandomElement(roomOptions.propertyAmenities);
    if (!propertyAmenities.includes(amenity)) {
      propertyAmenities.push(amenity);
    }
  }

  // Generate random facilities (3-6 items)
  const facilityCount = getRandomNumber(3, 6);
  const facilities = [];
  while (facilities.length < facilityCount) {
    const facility = getRandomElement(roomOptions.facilities);
    if (!facilities.includes(facility)) {
      facilities.push(facility);
    }
  }

  // Generate random rules (4-8 items)
  const ruleCount = getRandomNumber(4, 8);
  const rules = [];
  while (rules.length < ruleCount) {
    const rule = getRandomElement(roomOptions.rules);
    if (!rules.includes(rule)) {
      rules.push(rule);
    }
  }

  return {
    roomNumber: `R${(index + 1).toString().padStart(3, '0')}`,
    type: roomType,
    price: getRandomNumber(200, 800),
    capacity: capacity,
    location: location,
    nearbyUniversities: nearbyUniversities,
    distanceToUniversity: `${getRandomNumber(1, 10)} km`,
    floorLevel: getRandomElement(roomOptions.floorLevels),
    floor: `Floor ${getRandomNumber(1, 5)}`,
    size: `${getRandomNumber(15, 40)} sqm`,
    description: `Modern ${roomType} room with great amenities and convenient location.`,
    facilities: facilities,
    amenities: amenities,
    propertyAmenities: propertyAmenities,
    features: {
      quietStudyArea: getRandomBoolean(),
      preferredGender: getRandomElement(['male', 'female', 'any'])
    },
    building: {
      name: `${location} Residence`,
      location: location,
      wardenName: `Warden ${getRandomElement(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'])}`,
      emergencyContact: `+263${getRandomNumber(700000000, 799999999)}`
    },
    checkInTime: '14:00',
    leaseStart: 'Flexible',
    securityDeposit: getRandomNumber(100, 300),
    rules: rules,
    isAvailable: true
  };
};

// Main function to add random rooms
async function addRandomRooms() {
  let connection;
  try {
    // Connect to MongoDB with more detailed options
    console.log('Attempting to connect to MongoDB...');
    connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000, // 10 second timeout
    });
    console.log('Connected to MongoDB successfully');
    console.log(`Connected to database: ${connection.connection.db.databaseName}`);

    // Generate and add 20 random rooms
    const roomsToAdd = 20;
    console.log(`Adding ${roomsToAdd} random rooms...`);

    for (let i = 0; i < roomsToAdd; i++) {
      const roomData = generateRandomRoom(i);
      const room = new Room(roomData);
      await room.save();
      console.log(`Added room ${roomData.roomNumber} (${roomData.type} in ${roomData.location})`);
    }

    // Verify the rooms were added
    const totalRooms = await Room.countDocuments();
    console.log(`\nVerification: Total rooms in database: ${totalRooms}`);
    
    console.log('Successfully added all random rooms');
  } catch (error) {
    console.error('MongoDB Error:', error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB. Please check if:');
      console.error('1. MongoDB service is running');
      console.error('2. MongoDB is listening on port 27017');
      console.error('3. No firewall is blocking the connection');
    }
  } finally {
    if (connection) {
      await connection.connection.close();
      console.log('Closed MongoDB connection');
    }
  }
}

// Run the script
addRandomRooms(); 