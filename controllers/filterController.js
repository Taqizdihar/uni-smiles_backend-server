const filterModel = require('../models/filterModel');

/**
 * Filter Controller
 * Handles HTTP responses for Filter endpoints.
 */
const filterController = {
  /**
   * @desc    Get all active filters
   * @route   GET /api/filters
   * @access  Public
   */
  getAllActiveFilters: async (req, res, next) => {
    try {
      const filters = await filterModel.getAllActiveFilters();
      return res.status(200).json({
        success: true,
        count: filters.length,
        data: filters
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = filterController;
