const PaymentProfile = require('../models/paymentProfileModel');

const getKioskPaymentMethods = async (req, res) => {
  try {
    const user_id = req.kiosk.user_id;
    const profiles = await PaymentProfile.findByUserId(user_id);

    return res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminPaymentProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const profile = await PaymentProfile.findDefaultForKiosk(user_id);
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const uploadAdminQRIS = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const user_id = req.user.id;
    const fileUrl = '/uploads/' + req.file.filename;
    const payment_data = JSON.stringify({ qris_image_url: fileUrl });
    
    await PaymentProfile.upsertProfile({ user_id, payment_data });
    
    return res.status(200).json({ success: true, url: fileUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getKioskPaymentMethods, getAdminPaymentProfile, uploadAdminQRIS };
