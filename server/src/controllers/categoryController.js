const Category = require('../models/category');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const DEFAULT_CATEGORIES = [
  { name: 'General', description: 'General community infrastructure and maintenance issues' },
  { name: 'Electronic Waste', description: 'E-waste disposal, discarded electronics, and appliances' },
  { name: 'Dry Waste', description: 'Plastic, paper, cardboards, metal, and dry rubbish' },
  { name: 'Wet Waste', description: 'Organic waste, food leftovers, and compostable waste' }
];

/**
 * Get all issue categories (auto-seeds defaults if empty)
 */
const getCategories = async (req, res) => {
  let categories = await Category.find({ isActive: true }).sort({ name: 1 });

  if (categories.length === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    categories = await Category.find({ isActive: true }).sort({ name: 1 });
  }

  return sendSuccess(res, categories);
};

module.exports = {
  getCategories
};
