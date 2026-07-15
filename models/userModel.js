const pool = require('../config/db');

/**
 * User Model
 * Handles database operations for the `users` table.
 */
const userModel = {
  /**
   * Find a user by their email address
   * @param {string} email 
   * @returns {Promise<Object|null>} User record
   */
  findUserByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Insert a new user into the database
   * @param {Object} userData 
   * @returns {Promise<Object>} Created user record
   */
  createUser: async (userData) => {
    const { name, email, password_hash, role, partner_name } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, partner_name) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, role, partner_name || null]
    );
    return { id: result.insertId, name, email, role, partner_name };
  }
};

module.exports = userModel;
