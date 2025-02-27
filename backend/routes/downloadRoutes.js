const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g., 'your_cloud_name'
  api_key: process.env.CLOUDINARY_API_KEY,       // e.g., 'your_api_key'
  api_secret: process.env.CLOUDINARY_API_SECRET,   // e.g., 'your_api_secret'
});

// GET endpoint for resume (PDF)
router.get("/resume/:file", (req, res) => {
  const fileParam = req.params.file;

  // Remove .pdf extension if present (assuming public_id was stored without extension)
  let publicId = fileParam;
  if (publicId.endsWith(".pdf")) {
    publicId = publicId.slice(0, -4);
  }

  // Construct full public_id with folder prefix
  const fullPublicId = `resume/${publicId}`;

  // Generate the Cloudinary URL for a raw resource (PDF)
  const url = cloudinary.url(fullPublicId, { resource_type: "raw", secure: true });

  // Redirect to the Cloudinary URL
  res.redirect(url);
});

// GET endpoint for profile image
router.get("/profile/:file", (req, res) => {
  const fileParam = req.params.file;

  // If the file parameter includes an extension (e.g., '.jpg'), remove it.
  let publicId = fileParam;
  const dotIndex = publicId.lastIndexOf(".");
  if (dotIndex !== -1) {
    publicId = publicId.substring(0, dotIndex);
  }

  // Construct full public_id with folder prefix
  const fullPublicId = `profile/${publicId}`;

  // Generate the Cloudinary URL for an image
  const url = cloudinary.url(fullPublicId, { resource_type: "image", secure: true });

  // Redirect to the Cloudinary URL
  res.redirect(url);
});

module.exports = router;
