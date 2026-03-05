const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const pool = require('../config/db')

const loginUser = async (req, res) => {


  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required."
    });
  }
  try {
    const userResult = await pool.query(
      'SELECT * FROM students WHERE email = $1',
      [email.trim()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Account not found."
      });
    }

    const student = userResult.rows[0];

    const isMatch = await bcrypt.compare(
      password.trim(),
      student.student_password.trim()
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password."
      });
    }

    if (student.status !== 'accepted') {
      return res.status(403).json({
        success: false,
        message: `Status is ${student.status}`
      });
    }

    const token = jwt.sign(
      {
        id: student.student_id,
        track: student.current_track
      },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Welcome to the Academy!",
      token,
      user: {
        id: student.student_id,
        name: student.full_name,
        track: student.current_track
      }
    });

  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

const setPassword = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Password too short" });
  }
  try {
    const userCheck = await pool.query(
      `
      SELECT password_set
      FROM users
      WHERE id = $1
      `,
      [req.session.userId]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    if (userCheck.rows[0].password_set) {
      return res.status(400).json({ error: "Password already set" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE users
      SET password_hash = $1,
          password_set = true,
          access_token = NULL
      WHERE id = $2
      `,
      [hash, req.session.userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("SET PASSWORD ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { loginUser, setPassword };