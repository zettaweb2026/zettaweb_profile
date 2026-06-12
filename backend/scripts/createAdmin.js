require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webnexa';

async function createAdmin() {
  const ADMIN_NAME = (process.env.ADMIN_NAME || '').trim();
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim();

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
    process.exit(1);
  }

  await mongoose.connect(URI);

  // Remove previous users/admins to keep database clean
  const deleteResult = await User.deleteMany({ email: { $ne: ADMIN_EMAIL.toLowerCase().trim() } });
  if (deleteResult.deletedCount > 0) {
    console.log(`Removed ${deleteResult.deletedCount} previous user account(s).`);
  }

  const existingUser = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() }).select('+password');

  if (existingUser) {
    existingUser.name = ADMIN_NAME || existingUser.name;
    existingUser.role = 'admin';

    if (ADMIN_PASSWORD) {
      existingUser.password = ADMIN_PASSWORD;
    }

    await existingUser.save();
    console.log(`Admin account updated: ${existingUser.email}`);
  } else {
    const admin = await User.create({
      name: ADMIN_NAME || 'Admin',
      email: ADMIN_EMAIL.toLowerCase().trim(),
      password: ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log(`Admin account created: ${admin.email}`);
  }

  await mongoose.disconnect();
}

createAdmin().catch(async (error) => {
  console.error('Failed to create admin:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
