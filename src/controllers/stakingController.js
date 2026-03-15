const Stake = require('../models/Stake ');
const User  = require('../models/User');

const POOLS = [
  { id:1, name:'AI Oracle Pool 🤖', apy:24.5, lockDays:30, tvl:'12,400', min:100, desc:'Power AI applet inference.' },
  { id:2, name:'DeFi Vault 💰',     apy:18.2, lockDays:14, tvl:'8,200',  min:50,  desc:'Support DeFi oracle applets.' },
  { id:3, name:'Flash Pool ⚡',     apy:31.8, lockDays:7,  tvl:'3,100',  min:25,  desc:'High-yield short staking.' },
];

exports.getPools = async (req, res) => {
  res.json({ success: true, pools: POOLS });
};

exports.stake = async (req, res) => {
  try {
    const { walletAddress, poolId, amount } = req.body;
    if (!walletAddress || !poolId || !amount) {
      return res.status(400).json({ error: 'walletAddress, poolId, amount required' });
    }
    const pool = POOLS.find(p => p.id === parseInt(poolId));
    if (!pool) return res.status(404).json({ error: 'Pool not found' });

    let user = await User.findOne({ walletAddress });
    if (!user) user = await User.create({ walletAddress });
    if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

    user.balance      -= parseFloat(amount);
    user.stakedAmount += parseFloat(amount);
    user.stakingPool   = poolId;
    user.stakingStart  = new Date();
    await user.save();

    const unlocksAt = new Date();
    unlocksAt.setDate(unlocksAt.getDate() + pool.lockDays);

    const stake = await Stake.create({
      walletAddress,
      poolId:   parseInt(poolId),
      amount:   parseFloat(amount),
      apy:      pool.apy,
      lockDays: pool.lockDays,
      unlocksAt,
      status:  'active',
    });

    res.json({ success: true, stake, pool });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unstake = async (req, res) => {
  try {
    const { walletAddress, stakeId } = req.body;
    const stake = await Stake.findById(stakeId);
    if (!stake) return res.status(404).json({ error: 'Stake not found' });
    if (stake.walletAddress !== walletAddress) return res.status(403).json({ error: 'Unauthorized' });

    // Calculate rewards
    const days    = (Date.now() - stake.createdAt) / (1000 * 60 * 60 * 24);
    const rewards = stake.amount * (stake.apy / 100) * (days / 365);

    let user = await User.findOne({ walletAddress });
    if (!user) user = await User.create({ walletAddress });
    user.balance      += stake.amount + rewards;
    user.stakedAmount -= stake.amount;
    user.earnings     += rewards;
    await user.save();

    stake.status = 'completed';
    await stake.save();

    res.json({ success: true, returned: stake.amount, rewards: rewards.toFixed(4) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserStakes = async (req, res) => {
  try {
    const stakes = await Stake.find({ 
      walletAddress: req.params.walletAddress,
      status: 'active'
    });
    res.json({ success: true, stakes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};