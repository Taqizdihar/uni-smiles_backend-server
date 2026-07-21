const kioskModel = require('../models/kioskModel');
const crypto = require('crypto');
const pool = require('../config/db');
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

  getAdminKiosks: async (req, res) => {
    try {
      const user_id = req.user.id;
      const [rows] = await pool.query(
        'SELECT id, name, location, base_price, api_key, status, health, last_heartbeat FROM kiosks WHERE user_id = ? AND deleted_at IS NULL',
        [user_id]
      );
      return res.status(200).json({ success: true, data: rows });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
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
  createKiosk: async (req, res) => {
    try {
      const { id, name, location, base_price } = req.body;
      const user_id = req.user.id;
      const apiKey = 'kiosk_' + crypto.randomBytes(16).toString('hex');
      const finalId = id || 'KSK-' + Math.floor(1000 + Math.random() * 9000);

      await pool.query(
        'INSERT INTO kiosks (id, user_id, name, location, base_price, api_key, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [finalId, user_id, name, location, base_price, apiKey, 'offline']
      );

      return res.status(201).json({ success: true, message: 'Kiosk created successfully', data: { api_key: apiKey } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
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
