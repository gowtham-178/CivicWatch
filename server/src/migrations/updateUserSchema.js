// Run this once to update existing users
// Command: node server/src/migrations/updateUserSchema.js

const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all existing users
    const result = await User.updateMany(
      {},
      {
        $set: {
          isEmailVerified: true, // Mark existing users as verified
          emailOtp: null,
          otpExpiry: null
        },
        $unset: {
          address: 1 // Remove address field
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    console.log('Migration completed successfully');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers();
