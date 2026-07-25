const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./src/models/admin');
const readline = require('readline');
require('dotenv').config();

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
};

const createAdmin = async () => {
  try {
    // 1. Parse CLI arguments
    let username = process.argv[2];
    let email = process.argv[3];
    let password = process.argv[4];

    // 2. Fall back to interactive questions if arguments are missing
    if (!username || !email || !password) {
      console.log('--- Admin Account Setup ---');
      username = username || (await askQuestion('Enter Admin Username (default: admin): ')) || 'admin';
      email = email || (await askQuestion('Enter Admin Email (default: admin@civicwatch.com): ')) || 'admin@civicwatch.com';
      password = password || (await askQuestion('Enter Admin Password (default: admin123): ')) || 'admin123';
      console.log('---------------------------');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.email = email;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log(`\nAdmin account "${username}" already exists. Password and email updated successfully!`);
    } else {
      const admin = new Admin({
        username,
        email,
        password: hashedPassword,
        isActive: true
      });
      await admin.save();
      console.log(`\nAdmin created successfully with username "${username}" and email "${email}"`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\nError creating admin:', error);
    process.exit(1);
  }
};

createAdmin();