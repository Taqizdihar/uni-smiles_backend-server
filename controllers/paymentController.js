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

module.exports = { getKioskPaymentMethods };
