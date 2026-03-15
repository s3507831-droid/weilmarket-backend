const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  event:   { type: String, required: true },
  data:    { type: Object, default: {} },
  caller:  { type: String, default: '' },
  txHash:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);