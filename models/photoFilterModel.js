const pool = require('../config/db');

/**
 * Photo Filter Model
 * Handles the junction table `photo_filters` mapping photos to their applied filters.
 */
const photoFilterModel = {
  /**
   * Inserts multiple filter records for a specific photo
   * @param {number} photoId 
   * @param {Array<number|string>} filterIdsArray 
   * @returns {Promise<boolean>} True if successful
   */
  addFiltersToPhoto: async (photoId, filterIdsArray) => {
    if (!filterIdsArray || filterIdsArray.length === 0) return true;

    // Prepare a bulk insert array: [photo_id, filter_id, applied_order]
    const values = filterIdsArray.map((filterId, index) => [
      photoId, 
      parseInt(filterId, 10), 
      index + 1
    ]);

    const [result] = await pool.query(
      'INSERT INTO photo_filters (photo_id, filter_id, applied_order) VALUES ?',
      [values]
    );
    
    return result.affectedRows > 0;
  }
};

module.exports = photoFilterModel;
