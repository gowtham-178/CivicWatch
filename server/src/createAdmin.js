const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
require('dotenv').config();

async function createAdmin(username, email, password, role = 'admin') {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingAdmin) {
      console.log('❌ Admin with this username or email already exists');
      process.exit(1);
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      createdAt: new Date()
    });
    
    await newAdmin.save();
    console.log('✅ Admin created successfully:');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Usage: node createAdmin.js username email password [role]
const [username, email, password, role] = process.argv.slice(2);

if (!username || !email || !password) {
  console.log('Usage: node createAdmin.js <username> <email> <password> [role]');
  process.exit(1);
}

createAdmin(username, email, password, role);