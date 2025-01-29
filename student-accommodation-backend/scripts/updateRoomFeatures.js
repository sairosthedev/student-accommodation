const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const Room = require('../models/Room');

async function updateRoomFeatures() {
  try {
    console.log('Starting room features update...');
    
    // Find all rooms
    const rooms = await Room.find({});
    console.log(`Found ${rooms.length} rooms to update`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Update each room
    for (const room of rooms) {
      try {
        console.log(`Processing room ${room.roomNumber}...`);
        
        // Always update features to ensure proper structure
        const originalFeatures = room.features || {};
        room.features = {
          quietStudyArea: typeof originalFeatures.quietStudyArea === 'boolean' 
            ? originalFeatures.quietStudyArea 
            : false,
          preferredGender: ['male', 'female', 'any'].includes(originalFeatures.preferredGender)
            ? originalFeatures.preferredGender
            : 'any'
        };
        
        // Ensure floorLevel is set with a valid value
        if (!room.floorLevel || !['ground', 'low', 'mid', 'high'].includes(room.floorLevel)) {
          room.floorLevel = 'ground'; // Set default floor level
        }
        
        // Save the updated room
        const savedRoom = await room.save();
        updatedCount++;
        console.log(`Successfully updated room ${room.roomNumber}:`, {
          features: savedRoom.features,
          floorLevel: savedRoom.floorLevel
        });
      } catch (error) {
        errorCount++;
        console.error(`Error updating room ${room.roomNumber}:`, error.message);
      }
    }
    
    // Final report
    console.log('\nUpdate Summary:');
    console.log(`Total rooms processed: ${rooms.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Failed updates: ${errorCount}`);
    
    // Verify the updates
    console.log('\nVerifying updates...');
    const verifiedRooms = await Room.find({});
    console.log('\nVerification Results:');
    verifiedRooms.forEach(room => {
      console.log(`Room ${room.roomNumber}:`, {
        features: room.features,
        floorLevel: room.floorLevel
      });
    });
    
    console.log('\nScript completed.');
  } catch (error) {
    console.error('Error in updateRoomFeatures:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the update function
updateRoomFeatures(); 