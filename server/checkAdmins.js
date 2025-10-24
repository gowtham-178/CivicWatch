const mongoose = require('mongoose');
const Admin = require('./src/models/admin');
require('dotenv').config();

const checkAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const admins = await Admin.find({}, 'username email isActive createdAt');
    
    if (admins.length === 0) {
      console.log('No admins found in the database');
    } else {
      console.log(`Found ${admins.length} admin(s):`);
      console.log('----------------------------------------');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Status: ${admin.isActive ? 'Active' : 'Inactive'}`);
        console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
        console.log('----------------------------------------');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking admins:', error);
    process.exit(1);
  }
};

checkAdmins();