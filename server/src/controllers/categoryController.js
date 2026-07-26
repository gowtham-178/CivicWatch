const Category = require('../models/category');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const DEFAULT_CATEGORIES = [
  { name: 'General', description: 'General community infrastructure and maintenance issues' },
  { name: 'Waste Management', description: 'Overflowing bins, uncollected garbage, and sanitation hazards' },
  { name: 'Infrastructure Repair', description: 'Potholes, damaged roads, broken sidewalks, and public structures' },
  { name: 'Water Supply', description: 'Water leaks, pipe bursts, drainage, and sewage overflows' },
  { name: 'Street Lighting', description: 'Faulty streetlights, dark streets, and electrical hazards' },
  { name: 'Traffic & Safety', description: 'Traffic signal faults, road hazards, and pedestrian safety' },
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
