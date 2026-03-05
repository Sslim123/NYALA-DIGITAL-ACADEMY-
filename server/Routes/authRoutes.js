const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const app = express();
const router = express.Router();

const verifyToken = require("../middleware/auth");
const authController = require('../controllers/authController');


app.use(express.json());
router.post('/login', verifyToken, authController.loginUser);
router.post('/set-password', verifyToken, authController.setPassword);


app.post("/api/auth/token-login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    const result = await pool.query(
      `
      SELECT id, password_set
      FROM users
      WHERE access_token = $1
      AND free_access_enabled = true
      `,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = result.rows[0];

    req.session.userId = user.id;

    res.json({
      success: true,
      next:
        user.password_set === true
          ? "/free-course"
          : "/set-password",
    });
  } catch (err) {
    console.error("TOKEN LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const result = await pool.query(
    `
    SELECT id, password_hash
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  req.session.userId = user.id;
  res.json({ success: true });
});

module.exports = router;