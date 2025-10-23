const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
require('dotenv').config();

async function resetPassword(identifier, newPassword) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });
    
    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    admin.password = hashedPassword;
    await admin.save();
    
    console.log('✅ Password reset successfully for:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Usage: node resetAdminPassword.js <username_or_email> <new_password>
const [identifier, newPassword] = process.argv.slice(2);

if (!identifier || !newPassword) {
  console.log('Usage: node resetAdminPassword.js <username_or_email> <new_password>');
  process.exit(1);
}

resetPassword(identifier, newPassword);