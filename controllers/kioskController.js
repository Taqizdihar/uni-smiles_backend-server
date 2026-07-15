const kioskModel = require('../models/kioskModel');

/**
 * Kiosk Controller
 * Handles HTTP requests/responses for Kiosk endpoints.
 */
const kioskController = {
  /**
   * @desc    Get all kiosks
   * @route   GET /api/kiosks
   * @access  Public
   */
  getAllKiosks: async (req, res, next) => {
    try {
      const kiosks = await kioskModel.getAllKiosks();
      return res.status(200).json({
        success: true,
        count: kiosks.length,
        data: kiosks
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Get single kiosk by ID
   * @route   GET /api/kiosks/:id
   * @access  Public
   */
  getKioskById: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        res.status(400);
        throw new Error('Invalid Kiosk ID format. ID must be a number.');
      }

      const kiosk = await kioskModel.getKioskById(id);

      if (!kiosk) {
        res.status(404);
        throw new Error(`Kiosk not found with ID: ${id}`);
      }

      return res.status(200).json({
        success: true,
        data: kiosk
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = kioskController;
