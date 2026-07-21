const pool = require('../config/db');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, avatar_url, password_hash, role, partner_name, status, last_login_at, email_verified_at, created_at, updated_at FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, avatar_url, role, partner_name, status, last_login_at, email_verified_at, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async create(userData) {
    const { full_name, email, phone, password_hash, role, partner_name } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, phone, password_hash, role, partner_name) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, phone || null, password_hash, role, partner_name || null]
    );
    return result;
  },
};

module.exports = User;
