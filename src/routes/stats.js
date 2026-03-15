const express   = require('express');
const router    = express.Router();
const Applet    = require('../models/Applet');
const Execution = require('../models/Execution');
const User      = require('../models/User');
const weil      = require('../services/weilService');

router.get('/', async (req, res) => {
  try {
    const [totalApplets, totalTxns, totalUsers, chainData] = await Promise.all([
      Applet.countDocuments(),
      Execution.countDocuments(),
      User.countDocuments(),
      weil.listContracts(),
    ]);
    res.json({
      success: true,
      data: {
        totalApplets,
        totalTxns,
        totalUsers,
        onChainContracts: chainData?.total_count ?? 0,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;