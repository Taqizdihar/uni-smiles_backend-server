const pool = require('../config/db');

/**
 * Photo Model
 * Handles database operations for the `photos` table.
 */
const photoModel = {
  /**
   * Save a photo record to the database
   * @param {string} sessionId 
   * @param {string} url 
   * @returns {Promise<Object>} Created photo record
   */
  savePhoto: async (sessionId, url) => {
    const [result] = await pool.query(
      'INSERT INTO photos (session_id, url) VALUES (?, ?)',
      [sessionId, url]
    );
    return { id: result.insertId, session_id: sessionId, url };
  },

  /**
   * Retrieve all photos for a given session ID
   * @param {string} sessionId 
   * @returns {Promise<Array>} List of photos
   */
  getPhotosBySession: async (sessionId) => {
    const [rows] = await pool.query(
      'SELECT * FROM photos WHERE session_id = ? ORDER BY id ASC',
      [sessionId]
    );
    return rows;
  }
};

module.exports = photoModel;
