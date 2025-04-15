const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

// Get all suppliers
router.get('/', protect, getSuppliers);

// Get single supplier
router.get('/:id', protect, getSupplier);

// Create new supplier
router.post('/', protect, createSupplier);

// Update supplier
router.put('/:id', protect, updateSupplier);

// Delete supplier
router.delete('/:id', protect, deleteSupplier);

module.exports = router;