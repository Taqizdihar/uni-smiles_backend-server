const express = require('express');
const router = express.Router();
const kioskController = require('../controllers/kioskController');

const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/kiosks
 * @desc    Retrieve all kiosks
 */
router.get('/', kioskController.getAllKiosks);

/**
 * @route   GET /api/kiosks/:id
 * @desc    Retrieve a specific kiosk by ID
 */
router.get('/:id', kioskController.getKioskById);

/**
 * @route   POST /api/kiosks
 * @desc    Create a new kiosk (Admin only)
 */
router.post('/', verifyToken, kioskController.createKiosk);

/**
 * @route   PUT /api/kiosks/:id
 * @desc    Update a specific kiosk by ID (Admin only)
 */
router.put('/:id', verifyToken, kioskController.updateKiosk);

/**
 * @route   DELETE /api/kiosks/:id
 * @desc    Delete a specific kiosk by ID (Admin only)
 */
router.delete('/:id', verifyToken, kioskController.deleteKiosk);

module.exports = router;
