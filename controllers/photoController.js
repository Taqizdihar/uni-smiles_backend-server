const Photo = require('../models/photoModel');

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo file provided' });
    }

    const { session_code } = req.body;
    const fileUrl = '/uploads/' + req.file.filename;

    await Photo.create({ session_id: session_code, url: fileUrl });

    return res.status(201).json({ success: true, url: fileUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadPhoto };
