const pool = require('../config/db');

const FrameTemplate = {
  async getActiveFrames(userId) {
    const [rows] = await pool.query(
      'SELECT id, name, category, user_id, image_url, slot_count, layout_config, is_active, usage_count, created_at, updated_at FROM frame_templates WHERE is_active = 1 AND deleted_at IS NULL AND (user_id IS NULL OR user_id = ?)',
      [userId]
    );
    return rows;
  },

  async create(frameData) {
    const { name, category, user_id, image_url, slot_count, layout_config } = frameData;
    const [result] = await pool.query(
      'INSERT INTO frame_templates (name, category, user_id, image_url, slot_count, layout_config) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category || null, user_id || null, image_url, slot_count, layout_config ? JSON.stringify(layout_config) : null]
    );
    return result;
  },
};

module.exports = FrameTemplate;
