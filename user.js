const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  refCode: String,
  referredBy: String,
  wallet: {
    balance: { type: Number, default: 0 },
    refBonus: { type: Number, default: 0 }
  }
});
module.exports = mongoose.model('User', UserSchema);