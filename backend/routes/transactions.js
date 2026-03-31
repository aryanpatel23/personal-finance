const express = require('express');
const auth = require('../middleware/auth');
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

router.use(auth);

router.get('/', getTransactions);
router.post('/', addTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
