const pool = require('../config/db');

/**
 * Filter Model
 * Handles database queries for the `filters` table.
 */
const filterModel = {
  /**
   * Retrieves all active filters
   * @returns {Promise<Array>} List of filters
   */
  getAllActiveFilters: async () => {
    const [rows] = await pool.query('SELECT * FROM filters WHERE is_active = 1 ORDER BY id ASC');
    return rows;
  }
};

module.exports = filterModel;
