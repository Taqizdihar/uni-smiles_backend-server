const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { verifyToken } = require('../../middlewares/authMiddleware');
const paymentController = require('../../controllers/paymentController');

router.use(verifyToken);

router.get('/dashboard-stats', (req, res) => {
  return res.status(200).json({ success: true, message: 'Admin routes working' });
});

router.get('/payment-profile', paymentController.getAdminPaymentProfile);
router.post('/payment-profile/qris', upload.single('qris_image'), paymentController.uploadAdminQRIS);

module.exports = router;
