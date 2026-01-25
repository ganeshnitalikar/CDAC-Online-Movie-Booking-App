const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../utils/sendOtpEmail");
const db = require("../config/db");
const config = require("../config/jwt");
const result = require("../utils/result");


 // FORGOT PASSWORD

const forgotPassword = (req, res) => {
  const { email } = req.body;

  //  Validation
  if (!email) {
    return res.status(400).send(
      result.createResult("Email is required")
    );
  }

  //  Find active user
  db.query(
    "SELECT user_id, email, role FROM users WHERE email = ? AND is_active = 1",
    [email],
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

      const user = users[0];

      //  Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      //  Remove old OTPs
      db.query(
        "DELETE FROM user_otp WHERE user_id = ? AND otp_type = 'FORGOT_PASSWORD'",
        [user.user_id],
        (delErr) => {
          if (delErr) {
            return res.status(500).send(
              result.createResult("Failed to clear old OTPs")
            );
          }

          //  Insert new OTP
          db.query(
            `INSERT INTO user_otp (user_id, otp_code, otp_type, expires_at)
             VALUES (?, ?, 'FORGOT_PASSWORD', ?)`,
            [user.user_id, otp, expiresAt],
            async (otpErr) => {
              if (otpErr) {
                return res.status(500).send(
                  result.createResult("Failed to generate OTP")
                );
              }

              try {
                await sendOtpEmail(user.email, otp);

                return res.status(200).send(
                  result.createResult(null, {
                    message: "OTP sent successfully",
                    role: user.role
                  })
                );
              } catch (mailErr) {
                return res.status(500).send(
                  result.createResult("Failed to send OTP email")
                );
              }
            }
          );
        }
      );
    }
  );
};


 // RESET PASSWORD
 
const resetPassword = async (req, res) => {
  const { email, otp_code, new_password } = req.body;

  //  Validation
  if (!email || !otp_code || !new_password) {
    return res.status(400).send(
      result.createResult("All fields are required")
    );
  }

  //  Find user
  db.query(
    "SELECT user_id FROM users WHERE email = ? AND is_active = 1",
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

      const userId = users[0].user_id;

      //  Verify OTP
      db.query(
        `SELECT otp_id FROM user_otp
         WHERE user_id = ?
           AND otp_code = ?
           AND otp_type = 'FORGOT_PASSWORD'
           AND is_used = FALSE
           AND expires_at > NOW()
         LIMIT 1`,
        [userId, otp_code],
        async (otpErr, otps) => {
          if (otpErr) {
            return res.status(500).send(
              result.createResult("OTP verification failed")
            );
          }

          if (!otps.length) {
            return res.status(400).send(
              result.createResult("Invalid or expired OTP")
            );
          }

          try {
            //  Hash new password
            const hashedPassword = await bcrypt.hash(
              new_password,
              config.saltRounds
            );

            //  Update password
            db.query(
              "UPDATE users SET password_hash = ? WHERE user_id = ?",
              [hashedPassword, userId],
              (updErr) => {
                if (updErr) {
                  return res.status(500).send(
                    result.createResult("Failed to reset password")
                  );
                }

                //  Mark OTP as used
                db.query(
                  "UPDATE user_otp SET is_used = TRUE WHERE otp_id = ?",
                  [otps[0].otp_id]
                );

                return res.status(200).send(
                  result.createResult(null, "Password reset successful")
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
    }
  );
};

module.exports = {
  forgotPassword,
  resetPassword
};
