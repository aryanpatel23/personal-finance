const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await Transaction.find({
      userId: req.user.id,
      type: 'expense',
      date: { $gte: startOfMonth },
    });

    const spentByCategory = {};
    transactions.forEach((t) => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
    });

    const budgetsWithSpent = budgets.map((b) => ({
      ...b.toObject(),
      spent: spentByCategory[b.category] || 0,
    }));

    res.json(budgetsWithSpent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBudget = async (req, res) => {
  try {
    const budget = await Budget.create({ ...req.body, userId: req.user.id });
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid budget id' });
    }
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid budget id' });
    }
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
