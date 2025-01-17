const router = require('express').Router();
const authMiddleware = require('../middleware/auth.middleware');
const controller = require('../controller/LaserBlast.controller');

router.post('/game-outcome', authMiddleware.validateGameOutcome, controller.calculateGameOutcome);
router.get('/wallet', controller.getWallet);
module.exports = router;