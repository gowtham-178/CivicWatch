const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
require('dotenv').config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get custom credentials from command line arguments
    const username = process.argv[2] || 'admin';
    const email = process.argv[3] || 'admin@civicwatch.com';
    const password = process.argv[4] || 'admin123';
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });
    if (existingAdmin) {
      console.log('Admin with this username or email already exists');
      process.exit(1);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

seedAdmin();