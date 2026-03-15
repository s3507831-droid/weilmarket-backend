const AuditLog = require('../models/AuditLog');

exports.log = async (event, data = {}) => {
  try {
    await AuditLog.create({
      event,
      data,
      caller: data.caller || '',
      txHash: data.txHash || '',
    });
  } catch (e) {
    console.warn('[auditService] log failed:', e.message);
  }
};

exports.getLogs = async (limit = 20) => {
  return AuditLog.find().sort({ createdAt: -1 }).limit(limit);
};