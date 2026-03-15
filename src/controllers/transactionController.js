const Execution = require('../models/Execution');

exports.getTransactions = async (req, res) => {
  try {
    const txns = await Execution.find({ caller: req.params.walletAddress })
      .sort({ createdAt: -1 }).limit(20)
      .populate('appletId', 'name emoji category');
    res.json({ success: true, transactions: txns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};