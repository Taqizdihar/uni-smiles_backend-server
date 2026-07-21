const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { verifyToken } = require('../../middlewares/authMiddleware');
const paymentController = require('../../controllers/paymentController');
const kioskController = require('../../controllers/kioskController');
const dashboardController = require('../../controllers/dashboardController');
const frameTemplateController = require('../../controllers/frameTemplateController');

router.use(verifyToken);

router.get('/dashboard', dashboardController.getDashboardStats);

router.get('/payment-profile', paymentController.getAdminPaymentProfile);
router.post('/payment-profile/qris', upload.single('qris_image'), paymentController.uploadAdminQRIS);

router.get('/kiosks', kioskController.getAdminKiosks);
router.post('/kiosks', kioskController.createKiosk);

router.get('/templates', frameTemplateController.getTemplates);
router.post('/templates', upload.single('frame_image'), frameTemplateController.uploadTemplate);

module.exports = router;
