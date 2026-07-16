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
   * Get all users (excluding passwords)
   * @returns {Promise<Array>} List of users
   */
  getAllUsers: async () => {
    const [rows] = await pool.query('SELECT id, name, email, role, partner_name, created_at FROM users ORDER BY id ASC');
    return rows;
  },

  /**
   * Get a single user by ID (excluding password)
   * @param {number|string} id 
   * @returns {Promise<Object|null>} User record or null if not found
   */
  getUserById: async (id) => {
    const [rows] = await pool.query('SELECT id, name, email, role, partner_name, created_at FROM users WHERE id = ?', [id]);
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
  },

  /**
   * Update existing user details
   * @param {number|string} id 
   * @param {Object} userData 
   * @returns {Promise<boolean>} True if updated successfully
   */
  updateUser: async (id, userData) => {
    const { name, email, role, partner_name } = userData;
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, partner_name = ? WHERE id = ?',
      [name, email, role, partner_name || null, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Delete a user by ID
   * @param {number|string} id 
   * @returns {Promise<boolean>} True if deleted successfully
   */
  deleteUser: async (id) => {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = userModel;
