
const express = require("express")
const router = express.Router();
const pool = require('../../config/db');
//const supabase = require("../../config/supabase");
const verifyToken = require('../../middleware/auth');

router.get("/exam/attempt/:attemptId", verifyToken, async (req, res) => {

  try {

    const { attemptId } = req.params
    const userId = req.user.id

    const attempt = await pool.query(
      `SELECT exam_id, user_id
       FROM exam_attempts
       WHERE id=$1`,
      [attemptId]
    )

    if (!attempt.rows.length) {
      return res.status(404).json({ error: "Attempt not found" })
    }

    if (attempt.rows[0].user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized attempt access" })
    }

    const examId = attempt.rows[0].exam_id

    const questions = await pool.query(
      `SELECT q.id, q.question, q.options
       FROM exam_attempt_questions aq
       JOIN questions q
       ON q.id = aq.question_id
       WHERE aq.attempt_id=$1
       ORDER BY aq.order_index`,
      [attemptId]
    )
    const answers = await pool.query(
      `SELECT question_id, selected_option
       FROM exam_attempt_answers
       WHERE attempt_id=$1`,
      [attemptId]
    )

    const savedAnswers = {}

    answers.rows.forEach(a => {
      savedAnswers[a.question_id] = a.selected_option
    })

    res.json({
      exam_id: examId,
      questions: questions.rows,
      saved_answers: savedAnswers
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Exam loading failed"
    })

  }

})

module.exports = router;