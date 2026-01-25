const express = require("express");
const {
  forgotPassword,
  resetPassword
} = require("../controllers/auth.controller");

const router = express.Router();

// Forgot password (send OTP)
router.post("/forgot-password", forgotPassword);

// Reset password (verify OTP + update password)
router.post("/reset-password", resetPassword);

module.exports = router;
