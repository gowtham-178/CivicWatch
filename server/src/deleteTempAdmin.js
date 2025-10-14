const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

async function deleteTempAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete the admin with the specified email
    const result = await Admin.deleteOne({ email: 'email-temp@civicwatch.com' });
    
    if (result.deletedCount > 0) {
      console.log('Admin user deleted successfully');
    } else {
      console.log('Admin user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error deleting admin:', error);
    process.exit(1);
  }
}

deleteTempAdmin();