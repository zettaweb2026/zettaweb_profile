const connectDb = require('../config/db');

const dbMiddleware = async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error('MongoDB connection error in middleware:', error.message);
    // Continue so that requests that don't need MongoDB (or have fallback data) can still proceed
    next();
  }
};

module.exports = dbMiddleware;
