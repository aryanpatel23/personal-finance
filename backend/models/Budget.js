const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  maximum: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  theme: { type: String, default: '#7c3aed' },
  period: { type: String, default: 'monthly' },
});

module.exports = mongoose.model('Budget', budgetSchema);
