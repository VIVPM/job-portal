const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");

let schema = new mongoose.Schema(
  {
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: [6, 'password must have at least (6) characters'],
    },
    type: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { collation: { locale: "en" } }
);

// Password hashing
schema.pre("save", function (next) {
  let user = this;

  // if the data is not modified
  if (!user.isModified("password")) {
    return next();
  }

  console.log("DEBUG: Pre-save hook triggered. Hashing password...");
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error("DEBUG: Hashing error:", err);
      return next(err);
    }
    console.log("DEBUG: Password hashed successfully.");
    user.password = hash;
    next();
  });
});

// Password verification upon login
schema.methods.login = function (password) {
  let user = this;

  return new Promise((resolve, reject) => {
    console.log("DEBUG: Comparing password...");
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("DEBUG: Compare error:", err);
        reject(err);
      }
      if (result) {
        console.log("DEBUG: Password match!");
        resolve();
      } else {
        console.log("DEBUG: Password mismatch.");
        reject();
      }
    });
  });
};

module.exports = mongoose.model("UserAuth", schema);
