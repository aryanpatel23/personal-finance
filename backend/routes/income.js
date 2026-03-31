const express = require('express');
const auth = require('../middleware/auth');
const {
  getIncome,
  addIncome,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');

const router = express.Router();

router.use(auth);

router.get('/', getIncome);
router.post('/', addIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

module.exports = router;
