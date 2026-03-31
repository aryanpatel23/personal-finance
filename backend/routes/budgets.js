const express = require('express');
const auth = require('../middleware/auth');
const {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');

const router = express.Router();

router.use(auth);

router.get('/', getBudgets);
router.post('/', addBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
