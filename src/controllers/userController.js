const User      = require('../models/User');
const Applet    = require('../models/Applet');
const Execution = require('../models/Execution');

// POST /api/users/connect
exports.connectUser = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ error: 'walletAddress required' });
    let user = await User.findOne({ walletAddress });
    if (!user) user = await User.create({ walletAddress });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/:walletAddress
exports.getUser = async (req, res) => {
  try {
    let user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) user = await User.create({ walletAddress: req.params.walletAddress });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/:walletAddress/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    let user = await User.findOne({ walletAddress });
    if (!user) user = await User.create({ walletAddress });

    const myApplets    = await Applet.countDocuments({ owner: walletAddress });
    const totalApplets = await Applet.countDocuments();
    const totalTxns    = await Execution.countDocuments();
    const recentTxns   = await Execution.find({ caller: walletAddress })
      .sort({ createdAt: -1 }).limit(10)
      .populate('appletId', 'name emoji');

    // Weekly revenue (last 7 days)
    const weeklyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const date  = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0,0,0,0));
      const end   = new Date(date.setHours(23,59,59,999));
      const dayTxns = await Execution.find({
        caller:    walletAddress,
        createdAt: { $gte: start, $lte: end }
      });
      const revenue = dayTxns.reduce((sum, t) => sum + (t.feePaid || 0), 0);
      weeklyRevenue.push(parseFloat(revenue.toFixed(2)));
    }

    res.json({
      success: true,
      data: {
        balance:       user.balance.toFixed(4),
        earnings:      user.earnings.toFixed(4),
        invocations:   user.invocations,
        my_applets:    myApplets,
        total_applets: totalApplets,
        total_txns:    totalTxns,
        weekly_revenue: weeklyRevenue,
        audit:         recentTxns,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/:walletAddress/topup
exports.topUpBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    let user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) user = await User.create({ walletAddress: req.params.walletAddress });
    user.balance += parseFloat(amount || 10);
    await user.save();
    res.json({ success: true, balance: user.balance.toFixed(4) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};