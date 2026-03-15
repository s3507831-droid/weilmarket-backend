const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  yesVotes:    { type: Number, default: 0 },
  noVotes:     { type: Number, default: 0 },
  voters:      { type: [String], default: [] },
  isOpen:      { type: Boolean, default: true },
  createdBy:   { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', ProposalSchema);