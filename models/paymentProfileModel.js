const pool = require('../config/db');

const PaymentProfile = {
  async findByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT id, user_id, profile_name, payment_type, provider, display_name, merchant_name, account_name, account_number, payment_data, is_default, status, created_at, updated_at FROM payment_profiles WHERE user_id = ? AND deleted_at IS NULL',
      [userId]
    );
    return rows;
  },

  async findDefaultForKiosk(userId) {
    const [rows] = await pool.query(
      'SELECT id, user_id, profile_name, payment_type, provider, display_name, merchant_name, account_name, account_number, payment_data, is_default, status, created_at, updated_at FROM payment_profiles WHERE user_id = ? AND is_default = 1 AND deleted_at IS NULL LIMIT 1',
      [userId]
    );
    return rows[0] || null;
  },
};

module.exports = PaymentProfile;
