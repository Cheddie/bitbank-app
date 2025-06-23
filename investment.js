const mongoose = require('mongoose');
const InvestmentSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  amount: Number,
  startDate: Date,
  days: Number,
  dailyRate: { type: Number, default: 0.01 },
  status: { type: String, default: 'active' }
});
module.exports = mongoose.model('Investment', InvestmentSchema);