require('dotenv').config();
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");

const router = express.Router();

let resetTokens = {}; // Temporary storage for reset tokens

// Request Password Reset (Send Email)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }); // Check if the user exists

  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate a reset token
  const token = crypto.randomBytes(32).toString("hex");
  resetTokens[email] = token; // Save token temporarily

  // Create a reset link
  const resetLink = `https://billboard-management-system.com/reset-password?token=${token}&email=${email}`;
  // res.sendFile(path.join(__dirname, "build", "index.html"));
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email_user,
      pass: process.env.email_password, // Use App Password (not your real password)
    },
  });

  // Email Content
  const mailOptions = {
    from: process.env.email_user,
    to: email,
    subject: "Password Reset Request",
    text: `Click the link to reset your password: ${resetLink}`,
  };

  // Send Email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ message: "Error sending email" });
    }
    res.json({ message: "Password reset email sent!" });
  });
});


router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!resetTokens[email] || resetTokens[email] !== token) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword; // **Hash the password before saving**
  await user.save();

  delete resetTokens[email]; // Remove token after successful reset

  res.json({ message: "Password reset successful!" });
});


// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) return res.status(400).json({ message: "User not found" });

//   const token = crypto.randomBytes(32).toString("hex");
//   resetTokens[email] = token; // Store the token temporarily

//   // Send Email (replace with real email service)
//   console.log(`Password reset token for ${email}: ${token}`);

//   res.json({ message: "Reset the Password", token });
// });

// // Reset Password
// router.post("/reset-password", async (req, res) => {
//   const { email, token, newPassword } = req.body;

//   if (!resetTokens[email] || resetTokens[email] !== token) {
//     return res.status(400).json({ message: "Invalid or expired token" });
//   }

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not found" });

//   user.password = newPassword; // Make sure you hash the password before saving
//   await user.save();

//   delete resetTokens[email]; // Remove token after successful reset

//   res.json({ message: "Password reset successful!" });
// });

router.post("/signup", (req, res) => {
  const data = req.body;
  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
  });

  user
    .save()
    .then(() => {
      const userDetails =
        user.type == "recruiter"
          ? new Recruiter({
              userId: user._id,
              name: data.name,
              contactNumber: data.contactNumber,
              profile: data.profile,
              Company:data.Company,
              YearsExperience:data.YearsExperience,
              bio: data.bio,
            })
          : new JobApplicant({
              userId: user._id,
              name: data.name,
              education: data.education,
              contactNumber: data.contactNumber,
              skills: data.skills,
              rating: data.rating,
              resume: data.resume,
              profile: data.profile,
            });

      userDetails
        .save()
        .then(() => {
          // Token
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            type: user.type,
          });
        })
        .catch((err) => {
          user
            .delete()
            .then(() => {
              res.status(400).json({ message: "User already exists",err});
            })
            .catch((err) => {
              res.json({ error: err });
            });
          err;
        });
    })
    .catch((err) => {
      // res.status(400).json(err);
         res.status(400).json({ message: "User already exists", error: err });
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

module.exports = router;
