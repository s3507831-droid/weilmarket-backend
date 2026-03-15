const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  balance:       { type: Number, default: 0 },
  earnings:      { type: Number, default: 0 },
  invocations:   { type: Number, default: 0 },
  stakedAmount:  { type: Number, default: 0 },
  stakingPool:   { type: Number, default: null },
  stakingStart:  { type: Date,   default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);