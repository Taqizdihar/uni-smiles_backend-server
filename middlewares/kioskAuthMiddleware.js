const kioskModel = require('../models/kioskModel');

/**
 * Kiosk Authentication Middleware (Machine-to-Machine)
 * Validates the hardware kiosk requests using an API Key passed in the `x-api-key` header.
 */
const kioskAuthMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing API Key in x-api-key header.'
      });
    }

    const kiosk = await kioskModel.getKioskByApiKey(apiKey);

    if (!kiosk) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid API Key.'
      });
    }

    // Attach kiosk payload to request object
    req.kiosk = kiosk;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = kioskAuthMiddleware;
