const pool = require('../config/db');

/**
 * Dashboard Controller
 * Handles HTTP requests/responses for Admin Dashboard Analytics.
 */
const dashboardController = {
  /**
   * @desc    Get aggregated data for the admin dashboard
   * @route   GET /api/dashboard/stats
   * @access  Public (or Admin)
   */
  getStats: async (req, res, next) => {
    try {
      // Execute multiple analytics queries concurrently using Promise.all
      const [revenueResult, sessionsTodayResult, topTemplatesResult] = await Promise.all([
        // 1. Total revenue from completed sessions
        pool.query(`
          SELECT COALESCE(SUM(t.amount), 0) AS total_revenue 
          FROM sessions s 
          LEFT JOIN transactions t ON s.id = t.session_id 
          WHERE s.status = 'completed'
        `),
        // 2. Total sessions today
        pool.query(`
          SELECT COUNT(*) AS total_sessions_today 
          FROM sessions 
          WHERE DATE(created_at) = CURDATE()
        `),
        // 3. Top 3 most used frame_templates (join with sessions)
        pool.query(`
          SELECT ft.id, ft.name, ft.category, ft.image_url, COUNT(s.id) AS usage_count 
          FROM frame_templates ft 
          JOIN sessions s ON ft.id = s.frame_template_id 
          GROUP BY ft.id, ft.name, ft.category, ft.image_url 
          ORDER BY usage_count DESC 
          LIMIT 3
        `)
      ]);

      const totalRevenue = parseFloat(revenueResult[0][0].total_revenue) || 0;
      const totalSessionsToday = parseInt(sessionsTodayResult[0][0].total_sessions_today, 10) || 0;
      const topTemplates = topTemplatesResult[0];

      return res.status(200).json({
        success: true,
        data: {
          total_revenue: totalRevenue,
          total_sessions_today: totalSessionsToday,
          top_frame_templates: topTemplates
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
