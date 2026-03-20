const express = require("express")
const router = express.Router();
const pool = require('../../config/db');
//const supabase = require("../../config/supabase");
const verifyToken = require('../../middleware/auth');
router.post("/exam/autosave", verifyToken, async (req, res) => {
  const { attempt_id, answers } = req.body
  const user_id = req.user.id
  try {
    const attemptCheck = await pool.query(
      `SELECT * FROM exam_attempts
       WHERE id=$1
       AND user_id=$2
       AND status='in_progress'`,
      [attempt_id, user_id])
    if (!attemptCheck.rows.length) {
      return res.status(403).json({ error: "Invalid attempt" })
    }
    await pool.query(
      `UPDATE exam_attempts
       SET answers=$1
       WHERE id=$2`,
      [answers, attempt_id]
    )
    res.json({ saved: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Autosave failed"
    })
  }
});
module.exports = router;