const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({ ...req.body, userId: req.user.id });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
