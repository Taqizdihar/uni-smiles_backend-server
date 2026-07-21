const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const verifyApiKey = require('../../middlewares/apiKeyMiddleware');
const sessionController = require('../../controllers/sessionController');
const photoController = require('../../controllers/photoController');
const paymentController = require('../../controllers/paymentController');

router.use(verifyApiKey);

router.get('/payments', paymentController.getKioskPaymentMethods);
router.post('/sessions/start', sessionController.startSession);
router.post('/sessions/:session_code/payment', sessionController.verifyPayment);
router.post('/sessions/:session_code/photos', upload.single('photo'), photoController.uploadPhoto);
router.put('/sessions/:session_code/complete', sessionController.completeSession);

module.exports = router;
