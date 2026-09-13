const mongoose = require('mongoose');

let cachedDb = null;

const connectDb = async () => {
  // If connection is already open (readyState === 1), return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting, await the existing cached promise
  if (cachedDb) {
    await cachedDb;
    return mongoose.connection;
  }

  console.log('Initializing MongoDB connection...');
  cachedDb = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webnexa');

  try {
    await cachedDb;
  } catch (error) {
    cachedDb = null; // Clear failed connection promise
    throw error;
  }

  return mongoose.connection;
};

module.exports = connectDb;
