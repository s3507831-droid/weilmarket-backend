const Applet    = require('../models/Applet');
const Execution = require('../models/Execution');
const User      = require('../models/User');
const weil      = require('../services/weilService');
const audit     = require('../services/auditService');

// GET /api/applets
exports.getApplets = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const query = { isPublic: true };
    if (category && category !== 'all') query.category = category;
    if (search) query.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    const sortMap = {
      newest:     { createdAt: -1 },
      popular:    { executions: -1 },
      rating:     { rating: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
    };
    const applets = await Applet.find(query).sort(sortMap[sort] || { createdAt: -1 });
    res.json({ applets, total: applets.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/applets/:id
exports.getAppletById = async (req, res) => {
  try {
    const applet = await Applet.findById(req.params.id);
    if (!applet) return res.status(404).json({ error: 'Applet not found' });
    res.json(applet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/applets/owner/:address
exports.getByOwner = async (req, res) => {
  try {
    const applets = await Applet.find({ owner: req.params.address });
    res.json(applets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/applets
exports.createApplet = async (req, res) => {
  try {
    const chain  = await weil.simulateRegisterApplet(req.body.name, req.body.owner);
    const applet = await Applet.create({ ...req.body, onChainId: chain.onChainId, onChain: true });
    await audit.log('APPLET_DEPLOYED', { appletId: applet._id, caller: req.body.owner, txHash: chain.txHash });
    res.status(201).json({ applet, txHash: chain.txHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/applets/:id/invoke
exports.invokeApplet = async (req, res) => {
  try {
    const applet = await Applet.findById(req.params.id);
    if (!applet) return res.status(404).json({ error: 'Applet not found' });

    const { params, caller } = req.body;
    const chain = await weil.simulateOnChainInvoke(applet.onChainId, params, caller);

    const execution = await Execution.create({
      appletId: applet._id,
      caller:   caller || 'anonymous',
      params:   params || {},
      result:   chain.result,
      txHash:   chain.txHash,
      gasUsed:  chain.gasUsed,
      feePaid:  applet.price,
      status:   'success',
    });

    await Applet.findByIdAndUpdate(req.params.id, { $inc: { executions: 1 } });

    // Update caller balance
    let user = await User.findOne({ walletAddress: caller });
    if (!user) user = await User.create({ walletAddress: caller });
    user.invocations += 1;
    user.balance = Math.max(0, user.balance - applet.price);
    await user.save();

    // Update owner earnings
    let owner = await User.findOne({ walletAddress: applet.owner });
    if (!owner) owner = await User.create({ walletAddress: applet.owner });
    owner.earnings += applet.price * 0.975;
    await owner.save();

    await audit.log('APPLET_INVOKED', { appletId: applet._id, caller, txHash: chain.txHash });

    res.json({ execution, txHash: chain.txHash, result: chain.result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/applets/:id/review
exports.reviewApplet = async (req, res) => {
  try {
    const { rating } = req.body;
    const applet = await Applet.findById(req.params.id);
    if (!applet) return res.status(404).json({ error: 'Applet not found' });
    applet.rating = ((applet.rating * applet.executions) + rating) / (applet.executions + 1);
    await applet.save();
    res.json({ success: true, rating: applet.rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};