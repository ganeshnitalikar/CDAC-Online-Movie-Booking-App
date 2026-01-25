const express = require("express");
const  authenticate  = require("../middleware/auth.middleware");
const {
  register,
  login,
  updateProfile ,
  verifyAdminOtp,
  logout,
  refreshToken,
  getProfile,
  deleteAccount
} = require("../controllers/user.controller");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-profile",authenticate,updateProfile);
router.post("/verify-admin-otp", verifyAdminOtp);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", getProfile);
router.delete("/delete-account", deleteAccount);

module.exports = router;
