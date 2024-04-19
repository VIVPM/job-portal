const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const { bucket } = require('./firebaseConfig');


// router.get("/resume/:file", (req, res) => {
//   const address = path.join(__dirname, `../public/resume/${req.params.file}`);
//   fs.access(address, fs.F_OK, (err) => {
//     if (err) {
//       res.status(404).json({
//         message: "File not found",
//       });
//       return;
//     }
//     res.sendFile(address);
//   });
// });

router.get("/resume/:file", (req, res) => {
  const file = bucket.file(`resume/${req.params.file}`);

  file.getSignedUrl({
    action: 'read',
    expires: '23-03-2025'
  }).then(signedUrls => {
    // signedUrls[0] contains the file's public URL
    res.redirect(signedUrls[0]);
  }).catch(err => {
    console.error(err);
    res.status(404).json({ message: "File not found" });
  });
});


// router.get("/profile/:file", (req, res) => {
//   const address = path.join(__dirname, `../public/profile/${req.params.file}`);
//   fs.access(address, fs.F_OK, (err) => {
//     if (err) {
//       res.status(404).json({
//         message: "File not found",
//       });
//       return;
//     }
//     res.sendFile(address);
//   });
// });

router.get("/profile/:file", (req, res) => {
  const file = bucket.file(`profile/${req.params.file}`);

  file.getSignedUrl({
    action: 'read',
    expires: '23-03-2025' // Set an appropriate expiration time
  }).then(signedUrls => {
    // signedUrls[0] contains the file's public URL
    res.redirect(signedUrls[0]);
  }).catch(err => {
    console.error(err);
    res.status(404).json({ message: "File not found" });
  });
});


module.exports = router;
