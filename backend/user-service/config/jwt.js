
require("dotenv").config();

const config = {
  saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  secret: process.env.JWT_SECRET
};

if (!config.secret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

module.exports = config;
