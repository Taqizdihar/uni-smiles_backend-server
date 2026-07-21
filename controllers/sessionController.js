const crypto = require('crypto');
const Session = require('../models/sessionModel');
const Transaction = require('../models/transactionModel');

const startSession = async (req, res) => {
  try {
    const kiosk_id = req.kiosk.id;
    const { frame_template_id } = req.body;
    const session_code = crypto.randomBytes(4).toString('hex').toUpperCase();

    await Session.create({ session_code, kiosk_id, frame_template_id });

    return res.status(201).json({ success: true, session_code });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { session_code } = req.params;
    const amount = req.kiosk.base_price;
    const transaction_code = 'TRX-' + Date.now();

    await Transaction.create({
      session_id: session_code,
      transaction_code,
      amount,
      payment_method: 'QRIS',
    });

    // MVP: Manual QRIS — mark as success immediately
    await Transaction.updateStatusBySessionId(session_code, 'success');

    return res.status(200).json({ success: true, transaction_code });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const completeSession = async (req, res) => {
  try {
    const { session_code } = req.params;

    await Session.updateStatus(session_code, 'completed');

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { startSession, verifyPayment, completeSession };
