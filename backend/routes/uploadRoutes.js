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

const { bucket } = require('./firebaseConfig');


// router.post('/resume', upload.single('file'), (req, res) => {
//   const { file } = req;
//   if (!['application/pdf'].includes(file.mimetype)) {
//     return res.status(400).json({ message: 'Invalid format' }); // Return early to prevent further execution
//   }

//   const filename = `${uuidv4()}.pdf`; // Simplified the filename generation

//   pipeline(
//     Readable.from(file.buffer), // Create a readable stream from the buffer
//     fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
//   )
//     .then(() => {
//       res.send({
//         message: 'File uploaded successfully',
//         url: `/host/resume/${filename}`
//       });
//     })
//     .catch((err) => {
//       console.error(err); // Log the error for debugging purposes
//       res.status(500).json({ message: 'Error while uploading' });
//     });
// });

router.post('/resume', upload.single('file'), (req, res) => {
  const { file } = req;
  if (!file || !['application/pdf'].includes(file.mimetype)) {
    return res.status(400).json({ message: 'Invalid format' });
  }

  const filename = `${uuidv4()}.pdf`;
  const fileUpload = bucket.file(`resume/${filename}`);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on('error', (err) => {
    console.error(err);
    res.status(500).json({ message: 'Error while uploading' });
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
    res.send({
      message: 'File uploaded successfully',
      url: publicUrl,
    });
  });

  blobStream.end(file.buffer);
});

router.post('/profile', upload.single('file'), (req, res) => {
  const { file } = req;
  if (!file || !['image/jpg', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
    return res.status(400).json({ message: 'Invalid format' });
  }

  const filename = `${uuidv4()}${file.mimetype.replace('image/', '.')}`;
  const fileUpload = bucket.file(`profile/${filename}`);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on('error', (err) => {
    console.error(err);
    res.status(500).json({ message: 'Error while uploading' });
  });

  blobStream.on('finish', () => {
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
    res.send({
      message: 'Profile image uploaded successfully',
      url: publicUrl,
    });
  });

  blobStream.end(file.buffer);
});


// router.post('/profile', upload.single('file'), (req, res) => {
//   const { file } = req;

//   if (!['image/jpg', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
//     return res.status(400).json({ message: 'Invalid format' });
//   }

//   const filename = `${uuidv4()}${file.mimetype.replace('image/', '.')}`;
//   const filePath = `${__dirname}/../public/profile/${filename}`;
//   const writeStream = fs.createWriteStream(filePath);

//   // Creating a readable stream from the buffer and piping it to the write stream
//   Readable.from(file.buffer).pipe(writeStream);

//   writeStream.on('finish', () => {
//     res.send({
//       message: 'Profile image uploaded successfully',
//       url: `/host/profile/${filename}`
//     });
//   }).on('error', (err) => {
//     console.error(err); // Log the error for debugging purposes
//     res.status(500).json({ message: 'Error while uploading' });
//   });
// });

module.exports = router;
