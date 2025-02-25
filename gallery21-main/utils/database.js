// @utils/database.js

import mongoose from 'mongoose';

let isConnected = false; 

const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;
    console.log('MongoDB connected');

    return connection.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export { connectToDB };
