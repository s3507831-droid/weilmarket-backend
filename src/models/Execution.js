const mongoose = require('mongoose');

const ExecutionSchema = new mongoose.Schema({
  appletId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Applet', required: true },
  caller:    { type: String, required: true },
  params:    { type: Object, default: {} },
  result:    { type: String, default: '' },
  txHash:    { type: String, default: '' },
  gasUsed:   { type: Number, default: 0 },
  feePaid:   { type: Number, default: 0 },
  status:    { type: String, default: 'success' },
}, { timestamps: true });

module.exports = mongoose.model('Execution', ExecutionSchema);