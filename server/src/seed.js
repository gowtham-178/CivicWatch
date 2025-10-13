const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@civicwatch.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@civicwatch.com',
      password: 'admin123',
      phone: '+1234567890',
      address: '123 Admin Street, City, State',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@civicwatch.com');
    console.log('Password: admin123');

    // Create a regular user for testing
    const testUser = new User({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: 'user123',
      phone: '+1987654321',
      address: '456 User Avenue, City, State',
      role: 'user'
    });

    await testUser.save();
    console.log('Test user created successfully');
    console.log('Email: john.doe@email.com');
    console.log('Password: user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();