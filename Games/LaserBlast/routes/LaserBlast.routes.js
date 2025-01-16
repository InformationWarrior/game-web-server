const router = require('express').Router();
const authMiddleware = require('../middleware/auth.middleware');
const controller = require('../controller/LaserBlast.controller');

router.get("/wallet", controller.getWallet);
router.post('/game-outcome', authMiddleware.validateGameOutcome, controller.calculateGameOutcome);
module.exports = router;