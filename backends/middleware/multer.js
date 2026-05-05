// src/middleware/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'astu-league/id-cards',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

module.exports = multer({ storage });