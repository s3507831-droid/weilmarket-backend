const express  = require('express');
const cors     = require('cors');
require('dotenv').config();
const connectDB = require('./db');

connectDB();

const app = express();

app.use(cors({
  origin: '*',
  credentials: false,
}));
app.use(express.json());

// ── ROUTES ─────────────────────────────────────────
app.use('/api/applets',     require('./routes/applets'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/transactions',require('./routes/transactions'));
app.use('/api/staking',     require('./routes/staking'));
app.use('/api/governance',  require('./routes/governance'));
app.use('/api/stats',       require('./routes/stats'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🚀 WeilMarket Backend Running',
    version: '1.0.0',
    team: 'CodeZilla'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 WeilMarket Backend running on port ${PORT}`);
});