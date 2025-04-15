// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  searchProducts
} = require('../controllers/productController');

// Get all products
router.get('/', protect, getProducts);

// Get low stock products
router.get('/low-stock', protect, getLowStockProducts);

// Search products
router.get('/search', protect, searchProducts);

// Get single product
router.get('/:id', protect, getProduct);

// Create new product
router.post('/', protect, createProduct);

// Update product
router.put('/:id', protect, updateProduct);

// Delete product
router.delete('/:id', protect, deleteProduct);

module.exports = router;