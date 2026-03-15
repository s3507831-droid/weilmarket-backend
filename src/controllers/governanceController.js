const Proposal = require('../models/Proposal');

exports.getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ createdAt: -1 });
    if (proposals.length === 0) {
      await Proposal.insertMany([
        { title:'Reduce Base Invocation Fee', description:'Reduce minimum fee.', yesVotes:68, noVotes:32, voters:[], isOpen:true },
        { title:'Add Governance Staking Rewards', description:'Allocate 5% to governance.', yesVotes:82, noVotes:18, voters:[], isOpen:true },
        { title:'Cross-Pod Applet Chaining', description:'Enable cross-pod chaining.', yesVotes:91, noVotes:9, voters:[], isOpen:false },
        { title:'AI Profile NFT Certificates', description:'Mint NFT certificates.', yesVotes:74, noVotes:26, voters:[], isOpen:true },
      ]);
      const seeded = await Proposal.find().sort({ createdAt: -1 });
      return res.json({ success: true, proposals: seeded });
    }
    res.json({ success: true, proposals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProposal = async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });
    const proposal = await Proposal.create({ title, description, createdBy });
    res.status(201).json({ success: true, proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.vote = async (req, res) => {
  try {
    const { walletAddress, choice } = req.body;
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    if (!proposal.isOpen) return res.status(400).json({ error: 'Voting closed' });
    if (proposal.voters.includes(walletAddress)) {
      return res.status(400).json({ error: 'Already voted' });
    }
    if (choice === 'yes') proposal.yesVotes += 1;
    else proposal.noVotes += 1;
    proposal.voters.push(walletAddress);
    await proposal.save();
    res.json({ success: true, proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};