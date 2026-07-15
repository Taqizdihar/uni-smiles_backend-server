const express = require('express');
const router = express.Router();
const gestureController = require('../controllers/gestureController');

/**
 * @route   POST /api/gestures
 * @desc    Log a new user gesture from the kiosk
 */
router.post('/', gestureController.logGesture);

module.exports = router;
