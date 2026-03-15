const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/transactionController');

router.get('/:walletAddress', controller.getTransactions);

module.exports = router;