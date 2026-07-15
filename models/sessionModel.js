const pool = require('../config/db');

/**
 * Session Model
 * Handles database operations for sessions and related transactions.
 */
const sessionModel = {
  /**
   * Retrieve all sessions, including transaction details
   * @returns {Promise<Array>} List of sessions
   */
  getAllSessions: async () => {
    const [rows] = await pool.query(`
      SELECT s.*, t.amount, t.payment_method 
      FROM sessions s
      LEFT JOIN transactions t ON s.id = t.session_id
      ORDER BY s.id DESC
    `);
    return rows;
  },

  /**
   * Start a new session
   * @param {Object} sessionData 
   * @returns {Promise<Object>} Created session data
   */
  startSession: async (sessionData) => {
    const { id, kiosk_id, frame_template_id } = sessionData;
    const status = 'active';

    await pool.query(
      'INSERT INTO sessions (id, kiosk_id, frame_template_id, status) VALUES (?, ?, ?, ?)',
      [id, kiosk_id, frame_template_id, status]
    );

    return { id, kiosk_id, frame_template_id, status };
  },

  /**
   * Complete a session and record the transaction
   * @param {string} sessionId 
   * @param {Object} transactionData 
   * @returns {Promise<boolean>} True if successful
   */
  completeSession: async (sessionId, transactionData) => {
    const { transaction_code, amount, payment_method, status } = transactionData;
    
    // Get a connection for the transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Update the session status
      await connection.query(
        'UPDATE sessions SET status = ? WHERE id = ?',
        ['completed', sessionId]
      );

      // 2. Insert the transaction record
      await connection.query(
        'INSERT INTO transactions (transaction_code, session_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)',
        [transaction_code, sessionId, amount, payment_method, status]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = sessionModel;
