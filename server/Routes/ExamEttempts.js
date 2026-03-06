const express = require("express")
const router = express.Router();
const pool = require('../config/db');

router.post("/exam/start", async (req, res) => {
  const { user_id, exam_id } = req.body

  try {

    const examResult = await pool.query(
      "SELECT max_attempts FROM exams WHERE id=$1",
      [exam_id]
    )

    if (examResult.rows.length === 0) {
      return res.status(404).json({ error: "Exam not found" })
    }

    const maxAttempts = examResult.rows[0].max_attempts

    const attemptResult = await db.query(
      "SELECT COUNT(*) FROM exam_attempts WHERE user_id=$1 AND exam_id=$2",
      [user_id, exam_id]
    )

    const attempts = parseInt(attemptResult.rows[0].count)

    if (attempts >= maxAttempts) {
      return res.json({
        allowed: false,
        message: "Maximum attempts reached"
      })
    }

    const attemptNumber = attempts + 1

    const newAttempt = await db.query(
      `INSERT INTO exam_attempts 
      (user_id, exam_id, attempt_number)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [user_id, exam_id, attemptNumber]
    )

    res.json({
      allowed: true,
      attempt: newAttempt.rows[0]
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})
router.post("/submit", async (req, res) => {

  const { attempt_id, score } = req.body

  try {

    await db.query(
      `UPDATE exam_attempts
       SET score=$1,
       status='submitted',
       submitted_at=NOW()
       WHERE id=$2`,
      [score, attempt_id]
    )

    res.json({
      message: "Exam submitted"
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }

})
module.exports = router