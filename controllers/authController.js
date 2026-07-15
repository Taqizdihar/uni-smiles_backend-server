const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Auth Controller
 * Handles user registration and authentication.
 */
const authController = {
  /**
   * @desc    Authenticate user & get token
   * @route   POST /api/auth/login
   * @access  Public
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
      }

      const user = await userModel.findUserByEmail(email);
      if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role, partner_name: user.partner_name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          partner_name: user.partner_name
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Register a new user (used for initial setup or Admin invites)
   * @route   POST /api/auth/register
   * @access  Public
   */
  register: async (req, res, next) => {
    try {
      const { name, email, password, role, partner_name } = req.body;
      if (!name || !email || !password || !role) {
        res.status(400);
        throw new Error('Please provide name, email, password, and role');
      }

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        res.status(409);
        throw new Error('Email already in use');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const newUser = await userModel.createUser({
        name,
        email,
        password_hash,
        role,
        partner_name
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
