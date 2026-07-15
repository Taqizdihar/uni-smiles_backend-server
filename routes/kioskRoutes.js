const express = require('express');
const router = express.Router();
const kioskController = require('../controllers/kioskController');

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
 * @desc    Create a new kiosk
 */
router.post('/', kioskController.createKiosk);

module.exports = router;
