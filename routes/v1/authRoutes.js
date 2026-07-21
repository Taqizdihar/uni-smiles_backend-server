const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { verifyToken } = require('../../middlewares/authMiddleware');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get JWT
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post('/register', authController.register);

const userModel = require('../../models/userModel');

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user profile from database
 */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database'
      });
    }

    // Ensure role normalization matches dashboard expectations
    let normalizedRole = user.role;
    if (normalizedRole === 'admin') normalizedRole = 'Super Admin';
    else if (normalizedRole === 'operator') normalizedRole = 'Admin Mitra';
    user.role = normalizedRole;

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        partner_name: user.partner_name
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
