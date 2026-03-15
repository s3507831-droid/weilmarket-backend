const mongoose = require('mongoose');

const AppletSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  description:     { type: String, default: '' },
  category:        { type: String, default: 'utility' },
  price:           { type: Number, default: 0 },
  rating:          { type: Number, default: 0 },
  executions:      { type: Number, default: 0 },
  owner:           { type: String, required: true },
  emoji:           { type: String, default: '🔗' },
  badges:          { type: [String], default: ['mcp'] },
  isPublic:        { type: Boolean, default: true },
  onChainId:       { type: String, default: '' },
  contractAddress: { type: String, default: '' },
  onChain:         { type: Boolean, default: false },
  hot:             { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Applet', AppletSchema);