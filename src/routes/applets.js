const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/appletController');

router.get('/',                controller.getApplets);
router.get('/owner/:address',  controller.getByOwner);
router.get('/:id',             controller.getAppletById);
router.post('/',               controller.createApplet);
router.post('/:id/invoke',     controller.invokeApplet);
router.post('/:id/review',     controller.reviewApplet);

module.exports = router;