const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');

/**
 * @route   GET /api/filters
 * @desc    Get all active filters
 */
router.get('/', filterController.getAllActiveFilters);

module.exports = router;
