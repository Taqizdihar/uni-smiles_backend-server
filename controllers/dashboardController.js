const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [[{ total_kiosks }]] = await pool.query(
      'SELECT COUNT(id) AS total_kiosks FROM kiosks WHERE user_id = ? AND deleted_at IS NULL',
      [user_id]
    );

    const [[{ total_sessions }]] = await pool.query(
      "SELECT COUNT(s.session_code) AS total_sessions FROM sessions s JOIN kiosks k ON s.kiosk_id = k.id WHERE k.user_id = ? AND s.status = 'completed'",
      [user_id]
    );

    const [[{ total_revenue }]] = await pool.query(
      "SELECT SUM(t.amount) AS total_revenue FROM transactions t JOIN sessions s ON t.session_id = s.session_code JOIN kiosks k ON s.kiosk_id = k.id WHERE k.user_id = ? AND t.status = 'success'",
      [user_id]
    );

    return res.status(200).json({
      success: true,
      data: {
        total_kiosks: Number(total_kiosks) || 0,
        total_sessions: Number(total_sessions) || 0,
        total_revenue: Number(total_revenue) || 0
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
