const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Get all categories
router.get('/', protect, getCategories);

// Get single category
router.get('/:id', protect, getCategory);

// Create new category
router.post('/', protect, createCategory);

// Update category
router.put('/:id', protect, updateCategory);

// Delete category
router.delete('/:id', protect, deleteCategory);

module.exports = router;