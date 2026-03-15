const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/stakingController');

router.get('/pools',         controller.getPools);
router.post('/stake',        controller.stake);
router.post('/unstake',      controller.unstake);
router.get('/:walletAddress',controller.getUserStakes);

module.exports = router;