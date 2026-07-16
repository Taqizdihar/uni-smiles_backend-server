const pool = require('../config/db');

/**
 * Gesture Model
 * Handles database operations for the `gesture_logs` table.
 */
const gestureModel = {
  /**
   * Insert a new gesture log
   * @param {Object} gestureData 
   * @returns {Promise<Object>} Inserted gesture log
   */
  logGesture: async (gestureData) => {
    const { session_id, gesture_type, confidence_score, action_triggered } = gestureData;
    const [result] = await pool.query(
      'INSERT INTO gesture_logs (session_id, gesture_type, confidence_score, action_triggered) VALUES (?, ?, ?, ?)',
      [session_id, gesture_type, confidence_score, action_triggered]
    );
    return { id: result.insertId, ...gestureData };
  },

  /**
   * Get all gesture logs from the database
   * @returns {Promise<Array>} List of gesture logs
   */
  getAllGestures: async () => {
    const [rows] = await pool.query('SELECT * FROM gesture_logs ORDER BY id DESC');
    return rows;
  }
};

module.exports = gestureModel;
