const mongoose = require('mongoose');

let cachedDb = null;

const connectDb = async () => {
  // If connection is ready (1) or connecting (2), return immediately
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return mongoose.connection;
  }

  if (!cachedDb) {
    console.log('Initializing MongoDB connection...');
    cachedDb = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webnexa');
  }

  try {
    await cachedDb;
  } catch (error) {
    cachedDb = null; // Clear failed connection promise
    throw error;
  }

  return mongoose.connection;
};

module.exports = connectDb;
