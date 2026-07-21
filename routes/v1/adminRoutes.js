const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/dashboard-stats', (req, res) => {
  return res.status(200).json({ success: true, message: 'Admin routes working' });
});

module.exports = router;
