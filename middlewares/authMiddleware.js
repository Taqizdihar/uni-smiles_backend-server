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
    
    // Normalize role strings to ensure compatibility with Admin Dashboard database roles
    if (decoded.role === 'admin') {
      decoded.role = 'Super Admin';
    } else if (decoded.role === 'operator') {
      decoded.role = 'Admin Mitra';
    }

    const validRoles = ['Super Admin', 'Admin Mitra', 'Viewer'];
    if (!decoded.role || !validRoles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${decoded.role}' is not authorized to access this system`
      });
    }

    // Attach decoded user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized, token failed or expired'
    });
  }
};

/**
 * Authorize Roles Middleware
 * Restricts access to specific user roles registered in the database.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Access denied, user role not found'
      });
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${userRole}' is not allowed to access this resource`
      });
    }

    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
