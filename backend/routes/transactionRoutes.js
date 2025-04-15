const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

// Get all transactions
router.get('/', protect, getTransactions);

// Get single transaction
router.get('/:id', protect, getTransaction);

// Create new transaction
router.post('/', protect, createTransaction);

// Update transaction
router.put('/:id', protect, updateTransaction);

// Delete transaction
router.delete('/:id', protect, deleteTransaction);

module.exports = router;