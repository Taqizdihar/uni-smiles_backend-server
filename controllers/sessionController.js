const sessionModel = require('../models/sessionModel');
const photoModel = require('../models/photoModel');

/**
 * Session Controller
 * Handles HTTP requests/responses for Session endpoints.
 */
const sessionController = {
  /**
   * @desc    Get all sessions
   * @route   GET /api/sessions
   * @access  Public
   */
  getAllSessions: async (req, res, next) => {
    try {
      const sessions = await sessionModel.getAllSessions();
      return res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Start a new session
   * @route   POST /api/sessions/start
   * @access  Public
   */
  startSession: async (req, res, next) => {
    try {
      let { id, kiosk_id, frame_template_id } = req.body;

      if (!kiosk_id || !frame_template_id) {
        res.status(400);
        throw new Error('Please provide all required fields: kiosk_id, frame_template_id');
      }

      if (!id) {
        // Generate a unique session ID if not provided
        id = "#US-" + Date.now();
      }

      const newSession = await sessionModel.startSession({
        id,
        kiosk_id,
        frame_template_id
      });

      return res.status(201).json({
        success: true,
        message: 'Session started successfully.',
        data: newSession
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Complete a session and record the transaction
   * @route   POST /api/sessions/:id/complete
   * @access  Public
   */
  completeSession: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { transaction_code, amount, payment_method, status } = req.body;

      if (!id) {
        res.status(400);
        throw new Error('Session ID is required.');
      }

      if (!transaction_code || amount === undefined || !payment_method || !status) {
        res.status(400);
        throw new Error('Please provide transaction_code, amount, payment_method, and status.');
      }

      await sessionModel.completeSession(id, {
        transaction_code,
        amount,
        payment_method,
        status
      });

      return res.status(200).json({
        success: true,
        message: `Session ${id} completed successfully.`
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Send digital copy of session photo via email (mocked)
   * @route   POST /api/sessions/:id/send-email
   * @access  Public
   */
  sendDigitalCopy: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!id) {
        res.status(400);
        throw new Error('Session ID is required.');
      }

      if (!email) {
        res.status(400);
        throw new Error('Please provide an email address.');
      }

      // Check if there are uploaded photos for this session
      const photos = await photoModel.getPhotosBySession(id);
      const downloadLink = photos.length > 0
        ? photos[0].url
        : `/uploads/session_${encodeURIComponent(id)}_digital_copy.jpg`;

      // Mock email sending process
      return res.status(200).json({
        success: true,
        message: `Digital copy of photo sent successfully to ${email}.`,
        data: {
          session_id: id,
          recipient_email: email,
          download_link: downloadLink,
          all_photos: photos.map(p => p.url)
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = sessionController;
