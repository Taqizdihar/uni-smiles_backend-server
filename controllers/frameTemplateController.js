const pool = require('../config/db');

const getTemplates = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await pool.query(
      'SELECT id, name, image_url, slot_count, layout_config, is_active FROM frame_templates WHERE user_id = ? AND deleted_at IS NULL',
      [user_id]
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let { name, slot_count, layout_config } = req.body;
    const user_id = req.user.id;
    const imageUrl = '/uploads/' + req.file.filename;

    if (typeof layout_config === 'object') {
      layout_config = JSON.stringify(layout_config);
    }

    await pool.query(
      'INSERT INTO frame_templates (user_id, name, image_url, slot_count, layout_config, is_active) VALUES (?, ?, ?, ?, ?, 1)',
      [user_id, name, imageUrl, slot_count, layout_config]
    );

    return res.status(201).json({ success: true, message: 'Template uploaded successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTemplates,
  uploadTemplate
};
