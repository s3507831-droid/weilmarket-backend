const mongoose = require('mongoose');

const StakeSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  poolId:        { type: Number, required: true },
  amount:        { type: Number, required: true },
  apy:           { type: Number, default: 0 },
  lockDays:      { type: Number, default: 7 },
  status:        { type: String, default: 'active' },
  unlocksAt:     { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Stake', StakeSchema);