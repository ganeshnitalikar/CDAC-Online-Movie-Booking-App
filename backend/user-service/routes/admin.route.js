const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const authorizeAdmin = require("../middleware/role.middleware");
const { addTheaterOwner , getAllActiveUsers } = require("../controllers/admin.controller");

const router = express.Router();

router.post(
  "/add-theater-owner",
  authenticate,
  authorizeAdmin,
  addTheaterOwner
);

router.post(
  "/all-users",
  authenticate,
  authorizeAdmin,
  getAllActiveUsers
);


module.exports = router;