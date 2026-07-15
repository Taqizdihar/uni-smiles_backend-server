const photoModel = require('../models/photoModel');

/**
 * Photo Controller
 * Handles HTTP requests/responses for Photo endpoints.
 */
const photoController = {
  /**
   * @desc    Upload a photo and save its metadata
   * @route   POST /api/photos
   * @access  Public (or specific role if needed later)
   */
  uploadPhoto: async (req, res, next) => {
    try {
      const { session_id } = req.body;
      
      if (!session_id) {
        res.status(400);
        throw new Error('session_id is required in the request body.');
      }

      if (!req.file) {
        res.status(400);
        throw new Error('No photo file uploaded. Make sure to use the "photo" field in form-data.');
      }

      // Construct public URL path (statically served by Express)
      const url = `/uploads/${req.file.filename}`;

      // Save photo metadata to DB
      const newPhoto = await photoModel.savePhoto(session_id, url);

      res.status(201).json({
        success: true,
        message: 'Photo uploaded successfully.',
        data: newPhoto
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Get all photos for a specific session
   * @route   GET /api/photos/session/:sessionId
   * @access  Public
   */
  getPhotos: async (req, res, next) => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        res.status(400);
        throw new Error('Session ID is required.');
      }

      const photos = await photoModel.getPhotosBySession(sessionId);

      res.status(200).json({
        success: true,
        count: photos.length,
        data: photos
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = photoController;
