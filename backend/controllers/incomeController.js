const mongoose = require('mongoose');
const Income = require('../models/Income');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const income = await Income.create({ ...req.body, userId: req.user.id });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid income id' });
    }
    const income = await Income.findOne({ _id: req.params.id, userId: req.user.id });
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    const updated = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid income id' });
    }
    const income = await Income.findOne({ _id: req.params.id, userId: req.user.id });
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
