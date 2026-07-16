const jwt = require('jsonwebtoken');

/**
 * Verify Token Middleware
 * Protects routes by requiring a valid JWT in the Authorization header.
 */
const verifyToken = (req, res, next) => {
  let token;
  
  // Check if Bearer token is present
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to request object
    req.user = decoded;

    // Ensure the role is valid for access
    const validRoles = ['Super Admin', 'Admin Mitra', 'Viewer'];
    if (req.user && !validRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Not authorized, role ${req.user.role} is invalid`
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized, token failed or expired'
    });
  }
};

module.exports = { verifyToken };
