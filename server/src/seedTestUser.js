const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
require('dotenv').config();

async function seedTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create test user
    const hashedPassword = await bcrypt.hash('user123', 10);
    
    const testUser = new User({
      name: 'Test User',
      email: 'user@test.com',
      phone: '1234567890',
      address: 'Test Address',
      password: hashedPassword,
      role: 'user'
    });

    await testUser.save();
    console.log('Test user created successfully');
    console.log('Email: user@test.com');
    console.log('Password: user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

seedTestUser();