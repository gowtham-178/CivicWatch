const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const { getCategories } = require('../controllers/categoryController');

router.get('/', asyncHandler(getCategories));

module.exports = router;