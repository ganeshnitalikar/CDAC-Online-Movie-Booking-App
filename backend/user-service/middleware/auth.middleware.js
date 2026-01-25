
const jwt = require("jsonwebtoken");
const config = require("../config/jwt");
const result = require("../utils/result");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  //  Token missing
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send(
      result.createResult("Access denied. Token missing")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    //  Verify token
    const decoded = jwt.verify(token, config.secret);

    // attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    //  Invalid / expired token
    return res.status(401).send(
      result.createResult("Invalid or expired token")
    );
  }
};

module.exports = authenticate;

