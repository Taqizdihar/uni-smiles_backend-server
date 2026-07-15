const pool = require('../config/db');

/**
 * Kiosk Model
 * Handles all raw SQL queries related to the `kiosks` table.
 */
const kioskModel = {
  /**
   * Get all kiosks from the database
   * @returns {Promise<Array>} List of kiosks
   */
  getAllKiosks: async () => {
    const [rows] = await pool.query('SELECT * FROM kiosks ORDER BY id ASC');
    return rows;
  },

  /**
   * Get a single kiosk by ID
   * @param {number|string} id - Kiosk ID
   * @returns {Promise<Object|null>} Kiosk record or null if not found
   */
  getKioskById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM kiosks WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }
};

module.exports = kioskModel;
