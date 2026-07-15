const photoModel = require('../models/photoModel');
const photoFilterModel = require('../models/photoFilterModel');

/**
 * Photo Controller
 * Handles HTTP requests/responses for Photo endpoints.
 */
const photoController = {
  /**
   * @desc    Upload a photo and save its metadata & filters
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

      // Handle applied filters if provided
      let { filter_ids } = req.body;
      if (filter_ids) {
        // Parse filter_ids if it's sent as a JSON string (e.g. "[1, 3]") or comma-separated "1,3"
        if (typeof filter_ids === 'string') {
          try {
             filter_ids = JSON.parse(filter_ids);
          } catch(e) {
             filter_ids = filter_ids.split(',').map(id => id.trim());
          }
        }
        
        if (Array.isArray(filter_ids) && filter_ids.length > 0) {
           await photoFilterModel.addFiltersToPhoto(newPhoto.id, filter_ids);
           newPhoto.filters = filter_ids;
        }
      }

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
