const express = require("express")
const router = express.Router();
const pool = require('../../config/db');
const supabase = require("../../config/supabase");
const verifyToken = require('../../middleware/auth');

router.post("/exam/submit", verifyToken, async (req, res) => {

  const { attempt_id, answers } = req.body
  const user_id = req.user.id

  if (!attempt_id || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Invalid request" })
  }

  try {
    const attemptCheck = await pool.query(
      `SELECT * FROM exam_attempts
       WHERE id=$1
       AND user_id=$2
       AND status='in_progress'`,
      [attempt_id, user_id]
    )

    if (!attemptCheck.rows.length) {
      return res.status(403).json({ error: "Invalid attempt" })
    }

    const attempt = attemptCheck.rows[0]

    const questionResult = await pool.query(
      `SELECT q.id, q.correct_answer
       FROM exam_attempt_questions aq
       JOIN questions q ON q.id = aq.question_id
       WHERE aq.attempt_id = $1`,
      [attempt_id]
    )

    const questions = questionResult.rows
    let correctCount = 0

    answers.forEach(studentAnswer => {

      const original = questions.find(
        q => Number(q.id) === Number(studentAnswer.question_id)
      )
      if (original) {

        if (studentAnswer.selected === original.correct_answer) {
          correctCount++
        }

      }
console.log("student answer:", studentAnswer)
  console.log("matched question:", original)

    })

    const score = Math.round(
      (correctCount / questions.length) * 100
    )

    const unitInfo = await pool.query(
      `SELECT type FROM exams WHERE id=$1`,
      [attempt.exam_id]
    )

    const isFinal = unitInfo.rows[0]?.type === "final"

    const passingScore = isFinal ? 75 : 70

    const passed = score >= passingScore
    await pool.query(
      `UPDATE exam_attempts
       SET score=$1,
           passed=$2,
           status='submitted',
           submitted_at=NOW()
       WHERE id=$3`,
      [score, passed, attempt_id]
    )
    let certificate = null

    if (passed && isFinal) {

      const existing = await pool.query(
        `SELECT * FROM certificates
         WHERE user_id=$1 AND course_name=$2`,
        [user_id, "Digital Systems Foundations"]
      )

      if (!existing.rows.length) {

        const certificate_code = uuidv4()

        const cert = await pool.query(
          `INSERT INTO certificates
           (user_id, course_name, certificate_code, issued_at)
           VALUES ($1,$2,$3,NOW())
           RETURNING *`,
          [
            user_id,
            "Digital Systems Foundations",
            certificate_code
          ]
        )

        certificate = cert.rows[0]

      } else {

        certificate = existing.rows[0]

      }

    }

    res.json({
      score,
      passed,
      certificate
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Exam submission failed"
    })

  }

})
module.exports = router;