
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const pool = require("../config/db");
const config = require("../config/jwt");
const result = require("../utils/result");
const { sendOtpEmail } = require("../utils/sendOtpEmail");

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
        { sub: user.user_id, role: user.role },
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
          full_name : user.full_name,
          token,
          refresh_token: refreshToken,
          role: user.role
        })
      );
    }
  );
};

// UPDATE USER PROFILE

const updateProfile = (req, res) => {
  const { name, phone , city } = req.body;
  const userId = req.user.sub; 
  console.log("User Id " , userId)
 
  if (!name && !phone && !city) {
    return res.status(400).send(
      result.createResult("At least one field is required to update")
    );
  }

  pool.query(
    `UPDATE users
     SET 
       full_name = COALESCE(?, full_name),
       phone_number = COALESCE(?, phone_number),
       city = COALESCE(?, city),
       updated_at = NOW()
     WHERE user_id = ? AND is_active = 1`,
    [name, phone, city, userId],
    (err, response) => {
      if (err) {
        console.log(err);
        return res.status(500).send(result.createResult(err));
      }

      if (response.affectedRows === 0) {
        return res.status(404).send(
          result.createResult("User not found or inactive")
        );
      }

      return res.status(200).send(
        result.createResult(null, "Profile updated successfully")
      );
    }
  );
};


//   VERIFY ADMIN OTP

const verifyAdminOtp = async (req, res) => {
  const { email, otp_code } = req.body;

  if (!email || !otp_code) {
    return res.status(400).send(
      result.createResult("Email and OTP are required")
    );
  }

  pool.query(
    "SELECT user_id, role FROM users WHERE email = ? AND is_active = 1",
    [email],
    async (err, users) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Database error")
        );
      }

      if (!users.length) {
        return res.status(404).send(
          result.createResult("User not found")
        );
      }

      const user = users[0];

      if (user.role !== "ADMIN") {
        return res.status(403).send(
          result.createResult("OTP login allowed only for admin")
        );
      }

      const [otps] = await pool.promise().query(
        `SELECT otp_id FROM user_otp
         WHERE user_id = ?
           AND otp_code = ?
           AND otp_type = 'LOGIN'
           AND is_used = FALSE
           AND expires_at > NOW()
         LIMIT 1`,
        [user.user_id, otp_code]
      );

      if (!otps.length) {
        return res.status(400).send(
          result.createResult("Invalid or expired OTP")
        );
      }

      await pool.promise().query(
        "UPDATE user_otp SET is_used = TRUE WHERE otp_id = ?",
        [otps[0].otp_id]
      );

      const accessToken = jwt.sign(
        { user_id: user.user_id, role: user.role },
        config.secret,
        { expiresIn: "1h" }
      );

      const refreshToken = nanoid(64);
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );

      await pool.promise().query(
        `INSERT INTO user_tokens (user_id, refresh_token, expires_at)
         VALUES (?, ?, ?)`,
        [user.user_id, refreshToken, expiresAt]
      );

      return res.status(200).send(
        result.createResult(null, {
          full_name : user.full_name,
          token: accessToken,
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


//   REFRESH TOKEN

const refreshToken = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).send(
      result.createResult("Refresh token is required")
    );
  }

  pool.query(
    `SELECT ut.user_id, u.role
     FROM user_tokens ut
     JOIN users u ON ut.user_id = u.user_id
     WHERE ut.refresh_token = ?
       AND ut.is_revoked = FALSE
       AND ut.expires_at > NOW()`,
    [refresh_token],
    async (err, rows) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Database error")
        );
      }

      if (!rows.length) {
        return res.status(401).send(
          result.createResult("Invalid or expired refresh token")
        );
      }

      const { user_id, role } = rows[0];

      await pool.promise().query(
        "UPDATE user_tokens SET is_revoked = TRUE WHERE refresh_token = ?",
        [refresh_token]
      );

      const newAccessToken = jwt.sign(
        { user_id, role },
        config.secret,
        { expiresIn: "1h" }
      );

      const newRefreshToken = nanoid(64);
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );

      await pool.promise().query(
        `INSERT INTO user_tokens (user_id, refresh_token, expires_at)
         VALUES (?, ?, ?)`,
        [user_id, newRefreshToken, expiresAt]
      );

      return res.status(200).send(
        result.createResult(null, {
          token: newAccessToken,
          refresh_token: newRefreshToken
        })
      );
    }
  );
};

//   GET PROFILE

const getProfile = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send(
      result.createResult("Access denied. Token missing")
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, config.secret);
  } catch {
    return res.status(401).send(
      result.createResult("Invalid or expired token")
    );
  }
  pool.query(
    `SELECT user_id, full_name, email, phone_number, city, role
     FROM users WHERE user_id = ? AND is_active = 1`,
    [decoded.sub],
    (err, users) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Database error")
        );
      }
      if (!users.length) {
        return res.status(404).send(
          result.createResult("User not found")
        );
      }

      return res.status(200).send(
        result.createResult(null, users[0])
      );
    }
  );
};


//   DELETE ACCOUNT (SOFT)

const deleteAccount = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send(
      result.createResult("Token missing")
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.secret);
  } catch {
    return res.status(401).send(
      result.createResult("Invalid token")
    );
  }

  pool.query(
    "UPDATE users SET is_active = 0 WHERE user_id = ?",
    [decoded.user_id],
    (err) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Failed to delete account")
        );
      }

      return res.status(200).send(
        result.createResult(null, "Account deleted")
      );
    }
  );
};

module.exports = {
  register,
  login,
  updateProfile,
  verifyAdminOtp,
  logout,
  refreshToken,
  getProfile,
  deleteAccount
};