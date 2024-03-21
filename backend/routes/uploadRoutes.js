const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
// import multer from 'multer';

const pipeline = promisify(require('stream').pipeline);

const router = express.Router();

const upload = multer();
const { Readable } = require('stream');

router.post('/resume', upload.single('file'), (req, res) => {
  const { file } = req;
  if (!['application/pdf'].includes(file.mimetype)) {
    return res.status(400).json({ message: 'Invalid format' }); // Return early to prevent further execution
  }

  const filename = `${uuidv4()}.pdf`; // Simplified the filename generation

  pipeline(
    Readable.from(file.buffer), // Create a readable stream from the buffer
    fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
  )
    .then(() => {
      res.send({
        message: 'File uploaded successfully',
        url: `/host/resume/${filename}`
      });
    })
    .catch((err) => {
      console.error(err); // Log the error for debugging purposes
      res.status(500).json({ message: 'Error while uploading' });
    });
});

router.post('/profile', upload.single('file'), (req, res) => {
  const { file } = req;

  if (!['image/jpg', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
    return res.status(400).json({ message: 'Invalid format' });
  }

  const filename = `${uuidv4()}${file.mimetype.replace('image/', '.')}`;
  const filePath = `${__dirname}/../public/profile/${filename}`;
  const writeStream = fs.createWriteStream(filePath);

  // Creating a readable stream from the buffer and piping it to the write stream
  Readable.from(file.buffer).pipe(writeStream);

  writeStream.on('finish', () => {
    res.send({
      message: 'Profile image uploaded successfully',
      url: `/host/profile/${filename}`
    });
  }).on('error', (err) => {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ message: 'Error while uploading' });
  });
});

module.exports = router;
