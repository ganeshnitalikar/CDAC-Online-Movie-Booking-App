
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const pool = require("../config/db");
const config = require("../config/jwt");
const result = require("../utils/result");


//   REGISTER USER

const register = async (req, res) => {
  const { name, email, password, phone, city } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send(
      result.createResult("Full name, email and password are required")
    );
  }

  pool.query(
    "SELECT user_id, is_active FROM users WHERE email = ?",
    [email],
    async (err, rows) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Database error")
        );
      }

      if (rows.length) {
        if (rows[0].is_active === 0) {
          return res.status(403).send(
            result.createResult(
              "Account exists but is deactivated. Contact support."
            )
          );
        }

        return res.status(409).send(
          result.createResult("Email already registered")
        );
      }

      try {
        const hashedPassword = await bcrypt.hash(
          password,
          config.saltRounds
        );

        const user_id = nanoid();

        pool.query(
          `INSERT INTO users
           (user_id, full_name, email, password_hash, phone_number, city, role, is_active)
           VALUES (?, ?, ?, ?, ?, ?, 'USER', 1)`,
          [user_id, name, email, hashedPassword, phone, city],
          (insertErr) => {
            if (insertErr) {
              return res.status(500).send(
                result.createResult("Failed to register user")
              );
            }

            return res.status(201).send(
              result.createResult(null, "User registered successfully")
            );
          }
        );
      } catch {
        return res.status(500).send(
          result.createResult("Password hashing failed")
        );
      }
    }
  );
};

//   LOGIN

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send(
      result.createResult("Email and password required")
    );
  }

  pool.query(
    "SELECT * FROM users WHERE email = ? AND is_active = 1",
    [email],
    async (err, users) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Database error")
        );
      }

      if (!users.length) {
        return res.status(401).send(
          result.createResult("Invalid email")
        );
      }

      const user = users[0];

      const valid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!valid) {
        return res.status(401).send(
          result.createResult("Invalid password")
        );
      }

      // ADMIN → OTP FLOW
      if (user.role === "ADMIN") {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await pool.promise().query(
          "DELETE FROM user_otp WHERE user_id = ? AND otp_type = 'LOGIN'",
          [user.user_id]
        );

        await pool.promise().query(
          `INSERT INTO user_otp (user_id, otp_code, otp_type, expires_at)
           VALUES (?, ?, 'LOGIN', ?)`,
          [user.user_id, otp, expiresAt]
        );

        await sendOtpEmail(user.email, otp);

        return res.status(200).send(
          result.createResult(null, {
            requiresOtp: true,
            message: "OTP sent to admin email"
          })
        );
      }

      // NORMAL USER LOGIN
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        config.secret,
        { expiresIn: "1h" }
      );

      const refreshToken = nanoid(64);
      const refreshExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );

      await pool.promise().query(
        `INSERT INTO user_tokens (user_id, refresh_token, expires_at)
         VALUES (?, ?, ?)`,
        [user.user_id, refreshToken, refreshExpiresAt]
      );

      return res.status(200).send(
        result.createResult(null, {
          token,
          refresh_token: refreshToken,
          role: user.role
        })
      );
    }
  );
};



//   LOGOUT

const logout = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).send(
      result.createResult("Refresh token is required")
    );
  }

  pool.query(
    `UPDATE user_tokens
     SET is_revoked = TRUE
     WHERE refresh_token = ?
       AND is_revoked = FALSE`,
    [refresh_token],
    (err, dbRes) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Logout failed")
        );
      }

      if (!dbRes.affectedRows) {
        return res.status(401).send(
          result.createResult("Invalid or already logged out token")
        );
      }

      return res.status(200).send(
        result.createResult(null, "Logout successful")
      );
    }
  );
};



module.exports = {
  register,
  login,
  logout,
};
