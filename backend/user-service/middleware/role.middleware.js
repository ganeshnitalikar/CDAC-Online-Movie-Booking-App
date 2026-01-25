const result = require("../utils/result");

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.send(
      result.createResult("Admin access required")
    );
  }
  next();
};

module.exports = authorizeAdmin;
