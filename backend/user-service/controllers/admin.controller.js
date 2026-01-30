const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const pool = require("../config/db");
const config = require("../config/jwt");
const result = require("../utils/result");


 //  ADD THEATER OWNER (ADMIN ONLY)
 
const addTheaterOwner = async (req, res) => {
  const { full_name, email, password, phone_number, city } = req.body;
  console.log(req.body);
  //  Validation
  if (!full_name || !email || !password) {
    return res.status(400).send(
      result.createResult("Required fields missing")
    );
  }

  //  Check duplicate email
  pool.query(
    "SELECT user_id FROM users WHERE email = ?",
    [email],
    async (err, users) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Database error")
        );
      }

      if (users.length) {
        return res.status(409).send(
          result.createResult("Email already exists")
        );
      }

      try {
        //  Create Theater Owner
        const user_id = nanoid();
        const hashedPassword = await bcrypt.hash(
          password,
          config.saltRounds
        );

        pool.query(
          `INSERT INTO users
           (user_id, full_name, email, password_hash, phone_number, city, role)
           VALUES (?, ?, ?, ?, ?, ?, 'THEATER_OWNER')`,
          [user_id, full_name, email, hashedPassword, phone_number, city],
          (err2) => {
            if (err2) {
              return res.status(500).send(
                result.createResult("Failed to create Theater Owner")
              );
            }

            return res.status(201).send(
              result.createResult(null, "Theater Owner created successfully")
            );
          }
        );
      } catch (hashErr) {
        return res.status(500).send(
          result.createResult("Password hashing failed")
        );
      }
    }
  );
};

 
  //  GET ALL ACTIVE USERS (ADMIN)
 
const getAllActiveUsers = (req, res) => {
  pool.query(
    `SELECT user_id, full_name, email, phone_number, role, city, created_at
     FROM users
     WHERE is_active = 1 and role != 'ADMIN'`,
    (err, users) => {
      if (err) {
        return res.status(500).send(
          result.createResult("Database error")
        );
      }

      return res.status(200).send(
        result.createResult(null, users)
      );
    }
  );
};

module.exports = {
  addTheaterOwner,
  getAllActiveUsers
};