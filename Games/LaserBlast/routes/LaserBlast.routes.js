const router = require('express').Router();
const laserBlastController = require('../controller/LaserBlast.controller');

router.post('/game-outcome', laserBlastController.calculateGameOutcome);
module.exports = router;