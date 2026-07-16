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
  },

  /**
   * Get a kiosk by its API Key
   * @param {string} apiKey 
   * @returns {Promise<Object|null>} Kiosk record or null if not found
   */
  getKioskByApiKey: async (apiKey) => {
    const [rows] = await pool.query('SELECT * FROM kiosks WHERE api_key = ?', [apiKey]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new kiosk in the database with user ownership and API key
   * @param {string} id - Kiosk ID
   * @param {string} name - Kiosk Name
   * @param {string} location - Kiosk Location
   * @param {number} user_id - Owner User ID
   * @param {string} api_key - Secure API Key
   * @returns {Promise<Object>} SQL execution result
   */
  createKiosk: async (id, name, location, user_id, api_key) => {
    const [result] = await pool.query(
      'INSERT INTO kiosks (id, name, location, user_id, api_key) VALUES (?, ?, ?, ?, ?)',
      [id, name, location, user_id, api_key]
    );
    return result;
  },

  /**
   * Update an existing kiosk by ID
   * @param {string} id - Kiosk ID
   * @param {Object} kioskData - Kiosk details to update
   * @returns {Promise<boolean>} True if updated successfully
   */
  updateKiosk: async (id, kioskData) => {
    const { name, location } = kioskData;
    const [result] = await pool.query(
      'UPDATE kiosks SET name = ?, location = ? WHERE id = ?',
      [name, location, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Delete a kiosk by ID
   * @param {string} id - Kiosk ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  deleteKiosk: async (id) => {
    const [result] = await pool.query('DELETE FROM kiosks WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = kioskModel;
