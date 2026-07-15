const pool = require('../config/db');

/**
 * Helper to ensure layout_config is returned as a parsed JS object/array
 */
const formatTemplate = (row) => {
  if (!row) return null;
  if (row.layout_config && typeof row.layout_config === 'string') {
    try {
      row.layout_config = JSON.parse(row.layout_config);
    } catch (e) {
      console.warn(`Failed to parse layout_config for template ${row.id}:`, e.message);
    }
  }
  return row;
};

const frameTemplateModel = {
  /**
   * Get all frame templates
   * @returns {Promise<Array>} List of frame templates
   */
  getAllTemplates: async () => {
    const [rows] = await pool.query('SELECT * FROM frame_templates ORDER BY id ASC');
    return rows.map(formatTemplate);
  },

  /**
   * Get a frame template by ID
   * @param {number|string} id - Template ID
   * @returns {Promise<Object|null>} Template record or null if not found
   */
  getTemplateById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM frame_templates WHERE id = ?', [id]);
    return rows.length > 0 ? formatTemplate(rows[0]) : null;
  },

  /**
   * Create a new frame template
   * @param {Object} templateData - Template attributes
   * @returns {Promise<Object>} Created template record with ID
   */
  createTemplate: async (templateData) => {
    const { name, category, image_url, slot_count, layout_config } = templateData;
    
    // Ensure layout_config is serialized to JSON string for the DB insertion
    const serializedLayoutConfig = typeof layout_config === 'object' 
      ? JSON.stringify(layout_config) 
      : (layout_config || '{}');

    const [result] = await pool.query(
      'INSERT INTO frame_templates (name, category, image_url, slot_count, layout_config) VALUES (?, ?, ?, ?, ?)',
      [name, category, image_url, slot_count, serializedLayoutConfig]
    );

    return {
      id: result.insertId,
      ...templateData
    };
  },

  /**
   * Update an existing frame template
   * @param {number|string} id - Template ID
   * @param {Object} templateData - Template attributes to update
   * @returns {Promise<boolean>} True if update succeeded, false otherwise
   */
  updateTemplate: async (id, templateData) => {
    const { name, category, image_url, slot_count, layout_config } = templateData;
    
    // Ensure layout_config is serialized to JSON string if provided
    const serializedLayoutConfig = typeof layout_config === 'object' 
      ? JSON.stringify(layout_config) 
      : layout_config;

    const [result] = await pool.query(
      'UPDATE frame_templates SET name = ?, category = ?, image_url = ?, slot_count = ?, layout_config = ? WHERE id = ?',
      [name, category, image_url, slot_count, serializedLayoutConfig, id]
    );

    return result.affectedRows > 0;
  },

  /**
   * Delete a frame template by ID
   * @param {number|string} id - Template ID
   * @returns {Promise<boolean>} True if delete succeeded, false otherwise
   */
  deleteTemplate: async (id) => {
    const [result] = await pool.query('DELETE FROM frame_templates WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = frameTemplateModel;
