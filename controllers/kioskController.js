const kioskModel = require('../models/kioskModel');
const crypto = require('crypto');

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
   * @access  Private (Admin only)
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

      // Extract user_id from logged-in Admin's JWT
      const user_id = req.user ? req.user.id : null;
      if (!user_id) {
        res.status(401);
        throw new Error('Unauthorized: Admin User ID not found in token.');
      }

      // Generate a secure 64-character hex string API Key
      const api_key = crypto.randomBytes(32).toString('hex');

      await kioskModel.createKiosk(trimmedId, name, location, user_id, api_key);

      return res.status(201).json({
        success: true,
        message: 'Kiosk created successfully.',
        data: { 
          id: trimmedId, 
          name, 
          location, 
          user_id, 
          api_key // Return the API key only on creation so the Admin can copy it
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Update a kiosk by ID
   * @route   PUT /api/kiosks/:id
   * @access  Public (or Admin)
   */
  updateKiosk: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, location } = req.body;

      if (!id) {
        res.status(400);
        throw new Error('Kiosk ID is required.');
      }

      if (!name || !location) {
        res.status(400);
        throw new Error('Please provide all required fields: name, location');
      }

      const existingKiosk = await kioskModel.getKioskById(id);
      if (!existingKiosk) {
        res.status(404);
        throw new Error(`Kiosk not found with ID: ${id}`);
      }

      await kioskModel.updateKiosk(id, { name, location });

      const updatedKiosk = await kioskModel.getKioskById(id);

      return res.status(200).json({
        success: true,
        message: 'Kiosk updated successfully.',
        data: updatedKiosk
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Delete a kiosk by ID
   * @route   DELETE /api/kiosks/:id
   * @access  Public (or Admin)
   */
  deleteKiosk: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400);
        throw new Error('Kiosk ID is required.');
      }

      const existingKiosk = await kioskModel.getKioskById(id);
      if (!existingKiosk) {
        res.status(404);
        throw new Error(`Kiosk not found with ID: ${id}`);
      }

      await kioskModel.deleteKiosk(id);

      return res.status(200).json({
        success: true,
        message: `Kiosk with ID ${id} deleted successfully.`
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = kioskController;
