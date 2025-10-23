const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const admins = await Admin.find({});
    
    if (admins.length === 0) {
      console.log('❌ No admins found in database');
    } else {
      console.log('✅ Found admins:');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password Hash: ${admin.password ? 'Set' : 'Not Set'}`);
        console.log(`   Role: ${admin.role || 'admin'}`);
        console.log(`   Active: ${admin.isActive || 'undefined'}`);
        console.log(`   Created: ${admin.createdAt || 'N/A'}`);
        console.log('---');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAdmins();