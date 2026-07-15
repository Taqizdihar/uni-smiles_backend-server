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

      if (!id) {
        res.status(400);
        throw new Error('Kiosk ID is required.');
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
  },

  /**
   * @desc    Create a new kiosk
   * @route   POST /api/kiosks
   * @access  Public
   */
  createKiosk: async (req, res, next) => {
    try {
      const { id, name, location } = req.body;

      if (!id || !name || !location) {
        res.status(400);
        throw new Error('Please provide all required fields: id, name, location');
      }

      const trimmedId = String(id).trim();
      if (!trimmedId) {
        res.status(400);
        throw new Error('Kiosk ID cannot be empty.');
      }

      // Check if kiosk already exists
      const existingKiosk = await kioskModel.getKioskById(trimmedId);
      if (existingKiosk) {
        res.status(409); // 409 Conflict is more appropriate for duplicates
        throw new Error(`Kiosk with ID '${trimmedId}' already exists.`);
      }

      await kioskModel.createKiosk(trimmedId, name, location);

      return res.status(201).json({
        success: true,
        message: 'Kiosk created successfully.',
        data: { id: trimmedId, name, location }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = kioskController;
