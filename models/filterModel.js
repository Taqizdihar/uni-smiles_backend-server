const pool = require('../config/db');

/**
 * Filter Model
 * Handles database queries for the `filters` table.
 */
const filterModel = {
  /**
   * Retrieves all active filters
   * @returns {Promise<Array>} List of filters
   */
  getAllActiveFilters: async () => {
    const [rows] = await pool.query('SELECT * FROM filters WHERE is_active = 1 ORDER BY id ASC');
    return rows;
  },

  /**
   * Get a single filter by ID
   * @param {number|string} id 
   * @returns {Promise<Object|null>} Filter record
   */
  getFilterById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM filters WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new filter
   * @param {Object} filterData 
   * @returns {Promise<Object>} Created filter
   */
  createFilter: async (filterData) => {
    const { name, css_filter, is_active } = filterData;
    const activeVal = is_active !== undefined ? is_active : 1;
    const [result] = await pool.query(
      'INSERT INTO filters (name, css_filter, is_active) VALUES (?, ?, ?)',
      [name, css_filter, activeVal]
    );
    return { id: result.insertId, name, css_filter, is_active: activeVal };
  },

  /**
   * Update an existing filter by ID
   * @param {number|string} id 
   * @param {Object} filterData 
   * @returns {Promise<boolean>} True if updated successfully
   */
  updateFilter: async (id, filterData) => {
    const { name, css_filter, is_active } = filterData;
    const [result] = await pool.query(
      'UPDATE filters SET name = ?, css_filter = ?, is_active = ? WHERE id = ?',
      [name, css_filter, is_active !== undefined ? is_active : 1, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Delete a filter by ID
   * @param {number|string} id 
   * @returns {Promise<boolean>} True if deleted successfully
   */
  deleteFilter: async (id) => {
    const [result] = await pool.query('DELETE FROM filters WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = filterModel;
