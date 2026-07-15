const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

/**
 * @route   GET /api/sessions
 * @desc    Retrieve all sessions with transaction details
 */
router.get('/', sessionController.getAllSessions);

/**
 * @route   POST /api/sessions/start
 * @desc    Start a new session
 */
router.post('/start', sessionController.startSession);

/**
 * @route   POST /api/sessions/:id/complete
 * @desc    Complete a session and record the transaction
 */
router.post('/:id/complete', sessionController.completeSession);

module.exports = router;
