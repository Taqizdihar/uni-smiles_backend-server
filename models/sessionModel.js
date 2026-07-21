const pool = require('../config/db');

const Session = {
  async create(sessionData) {
    const { session_code, kiosk_id, frame_template_id } = sessionData;
    const [result] = await pool.query(
      'INSERT INTO sessions (session_code, kiosk_id, frame_template_id, status, started_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [session_code, kiosk_id, frame_template_id, 'active']
    );
    return result;
  },

  async updateStatus(sessionCode, status) {
    const endedAt = status === 'completed' ? 'CURRENT_TIMESTAMP' : null;
    if (status === 'completed') {
      const [result] = await pool.query(
        'UPDATE sessions SET status = ?, ended_at = CURRENT_TIMESTAMP WHERE session_code = ?',
        [status, sessionCode]
      );
      return result;
    }
    const [result] = await pool.query(
      'UPDATE sessions SET status = ? WHERE session_code = ?',
      [status, sessionCode]
    );
    return result;
  },

  async findByCode(sessionCode) {
    const [rows] = await pool.query(
      'SELECT session_code, kiosk_id, frame_template_id, status, started_at, ended_at, created_at, updated_at FROM sessions WHERE session_code = ? LIMIT 1',
      [sessionCode]
    );
    return rows[0] || null;
  },
};

module.exports = Session;
