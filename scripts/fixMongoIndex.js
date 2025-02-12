import { MongoClient } from 'mongodb';

const fixIndex = async () => {
  const uri = 'mongodb+srv://macdonaldsairos24:knWZgSjmHkQnLVwW@studentaccomodation.gazht.mongodb.net/?retryWrites=true&w=majority&appName=studentaccomodation';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('test');
    const collection = db.collection('users');

    // Drop the existing index
    try {
      await collection.dropIndex('applicationCode_1');
      console.log('Dropped existing index');
    } catch (error) {
      console.log('No existing index to drop');
    }

    // Create new index with partial filter
    await collection.createIndex(
      { applicationCode: 1 },
      { 
        unique: true,
        partialFilterExpression: { 
          role: 'student',
          applicationCode: { $exists: true }
        }
      }
    );
    console.log('Created new index');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
};

fixIndex(); 