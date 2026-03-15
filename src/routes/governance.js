const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/governanceController');

router.get('/',          controller.getProposals);
router.post('/',         controller.createProposal);
router.post('/:id/vote', controller.vote);

module.exports = router;