const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/userController');

router.post('/connect',              controller.connectUser);
router.get('/:walletAddress',        controller.getUser);
router.get('/:walletAddress/dashboard', controller.getDashboard);
router.post('/:walletAddress/topup', controller.topUpBalance);

module.exports = router;