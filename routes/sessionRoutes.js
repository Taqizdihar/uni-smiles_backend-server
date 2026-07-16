const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

const kioskAuthMiddleware = require('../middlewares/kioskAuthMiddleware');

/**
 * @route   GET /api/sessions
 * @desc    Retrieve all sessions with transaction details
 */
router.get('/', sessionController.getAllSessions);

/**
 * @route   GET /api/sessions/:id
 * @desc    Retrieve single session by ID
 */
router.get('/:id', sessionController.getSessionById);

/**
 * @route   POST /api/sessions/start
 * @desc    Start a new session
 */
router.post('/start', kioskAuthMiddleware, sessionController.startSession);

/**
 * @route   POST /api/sessions/:id/complete
 * @desc    Complete a session and record the transaction
 */
router.post('/:id/complete', kioskAuthMiddleware, sessionController.completeSession);

/**
 * @route   POST /api/sessions/:id/send-email
 * @desc    Send digital copy of session photo via email (mocked)
 */
router.post('/:id/send-email', kioskAuthMiddleware, sessionController.sendDigitalCopy);

module.exports = router;
