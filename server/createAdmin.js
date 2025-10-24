const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./src/models/admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new Admin({
      username: 'admin',
      email: 'admin@civicwatch.com',
      password: hashedPassword,
      isActive: true
    });
    
    await admin.save();
    console.log('Admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();