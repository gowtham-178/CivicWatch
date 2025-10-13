const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { auth, adminRequired } = require('../middleware/middleware');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create a new category (admin only)
router.post('/', auth, adminRequired, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, error: 'Category already exists' });
    }
    
    const newCategory = new Category({
      name,
      description,
      color: color || '#3B82F6'
    });
    
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update a category (admin only)
router.put('/:id', auth, adminRequired, async (req, res) => {
  try {
    const { name, description, color, isActive } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, color, isActive },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    res.json({ success: true, data: category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete a category (admin only)
router.delete('/:id', auth, adminRequired, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    res.json({ success: true, message: 'Category deactivated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;