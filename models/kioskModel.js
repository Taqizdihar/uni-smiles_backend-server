const pool = require('../config/db');

const Kiosk = {
  async findByApiKey(apiKey) {
    const [rows] = await pool.query(
      'SELECT id, name, location, base_price, user_id, api_key, status, health, config, last_heartbeat, created_at, updated_at FROM kiosks WHERE api_key = ? AND deleted_at IS NULL LIMIT 1',
      [apiKey]
    );
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT id, name, location, base_price, user_id, api_key, status, health, config, last_heartbeat, created_at, updated_at FROM kiosks WHERE user_id = ? AND deleted_at IS NULL',
      [userId]
    );
    return rows;
  },

  async updateHeartbeat(id, healthData) {
    const [result] = await pool.query(
      'UPDATE kiosks SET last_heartbeat = CURRENT_TIMESTAMP, health = ? WHERE id = ? AND deleted_at IS NULL',
      [JSON.stringify(healthData), id]
    );
    return result;
  },

  async create(kioskData) {
    const { id, name, location, base_price, user_id, api_key, status, config } = kioskData;
    const [result] = await pool.query(
      'INSERT INTO kiosks (id, name, location, base_price, user_id, api_key, status, config) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, location, base_price, user_id, api_key, status || 'offline', config ? JSON.stringify(config) : null]
    );
    return result;
  },
};

module.exports = Kiosk;
