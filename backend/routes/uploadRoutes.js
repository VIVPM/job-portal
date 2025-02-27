const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

const router = express.Router();
const upload = multer();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g., 'your_cloud_name'
  api_key: process.env.CLOUDINARY_API_KEY,       // e.g., 'your_api_key'
  api_secret: process.env.CLOUDINARY_API_SECRET,   // e.g., 'your_api_secret'
});

// Resume upload endpoint (for PDFs)
router.post('/resume', upload.single('file'), (req, res) => {
  const { file } = req;
  if (!file || file.mimetype !== 'application/pdf') {
    return res.status(400).json({ message: 'Invalid format' });
  }

  const publicId = uuidv4();

  // Upload PDF as a raw resource to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'resume',
      public_id: publicId,
      resource_type: 'raw', // Specify raw so that Cloudinary doesn't treat it as an image
      format: 'pdf',        // Ensure the format is pdf
    },
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error while uploading', error });
      }
      res.send({
        message: 'File uploaded successfully',
        url: result.secure_url,
      });
    }
  );

  streamifier.createReadStream(file.buffer).pipe(uploadStream);
});

// Profile image upload endpoint (for JPG/PNG/JPEG)
router.post('/profile', upload.single('file'), (req, res) => {
  const { file } = req;
  if (
    !file ||
    !['image/jpg', 'image/png', 'image/jpeg'].includes(file.mimetype)
  ) {
    return res.status(400).json({ message: 'Invalid format' });
  }

  const publicId = uuidv4();
  // Determine extension from mimetype (e.g., jpg, png)
  const extension = file.mimetype.split('/')[1];

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'profile',
      public_id: publicId,
      resource_type: 'image', // Cloudinary defaults to image for these types
      format: extension,
    },
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error while uploading', error });
      }
      res.send({
        message: 'Profile image uploaded successfully',
        url: result.secure_url,
      });
    }
  );

  streamifier.createReadStream(file.buffer).pipe(uploadStream);
});

module.exports = router;
