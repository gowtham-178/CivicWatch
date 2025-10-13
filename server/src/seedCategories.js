const mongoose = require('mongoose');
const Category = require('./models/category');
require('dotenv').config();

const categories = [
  { name: 'Infrastructure', description: 'Roads, bridges, public buildings' },
  { name: 'Public Safety', description: 'Crime, emergency services, safety hazards' },
  { name: 'Environmental', description: 'Pollution, waste management, green spaces' },
  { name: 'Utilities', description: 'Water, electricity, gas, internet' },
  { name: 'Other', description: 'General community issues' }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Category.deleteMany({});
    await Category.insertMany(categories);
    
    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();