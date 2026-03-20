const express = require("express")
const router = express.Router();
const pool = require('../../config/db');
const verifyToken = require('../../middleware/auth');

router.post("/exam/start", verifyToken, async (req, res) => {

  const { exam_id } = req.body
  const user_id = req.user.id

  if (!exam_id) {
    return res.status(400).json({ error: "Missing exam_id" })
  }

  const client = await pool.connect()

  try {

    await client.query("BEGIN")

    const maxAttempts = 3

    // -------------------------------
    // 1️⃣ Check if exam exists
    // -------------------------------
    const examQuery = await client.query(
      `SELECT id, type, unit_id
       FROM exams
       WHERE id=$1`,
      [exam_id]
    )

    if (!examQuery.rows.length) {
      await client.query("ROLLBACK")
      return res.status(404).json({ message: "Exam not found" })
    }

    const exam = examQuery.rows[0]
    const isFinal = exam.type === "final"


    // -------------------------------
    // 2️⃣ Check progress unlock rule
    // -------------------------------
    if (!isFinal) {

      const progress = await client.query(
          `SELECT
l.unit_id,

COUNT(m.id) FILTER (
  WHERE m.type IN ('lab','homework','assessment','reading')
) AS total,

COUNT(
  DISTINCT COALESCE(s.material_id, d.material_id)
) FILTER (
  WHERE m.type IN ('lab','homework','assessment','reading')
) AS completed

FROM lessons l

LEFT JOIN materials m
ON m.lesson_id = l.id

LEFT JOIN submissions s
ON s.material_id = m.id
AND s.student_id = $1

LEFT JOIN material_downloads d
ON d.material_id = m.id
AND d.student_id = $1

GROUP BY l.unit_id
ORDER BY l.unit_id`,[user_id]
      )

      const row = progress.rows[0]

      const percent = row.total > 0
        ? Math.round((row.completed / row.total) * 100)
        : 0

      if (percent < 70) {
        await client.query("ROLLBACK")
        return res.status(403).json({
          message: "أكمل 70% من أنشطة الوحدة لفتح هذا الاختبار"
        })
      }

    } else {

      const progress = await client.query(
        `SELECT
           COUNT(m.id) AS total,
           COUNT(s.material_id) AS submitted
         FROM lessons l
         LEFT JOIN materials m ON m.lesson_id = l.id
         LEFT JOIN submissions s
           ON s.material_id = m.id
           AND s.student_id = $1
         WHERE m.type IN ('lab','homework','assessment')
         AND l.is_final = false`,
        [user_id]
      )

      const row = progress.rows[0]

      const percent = row.total > 0
        ? Math.round((row.submitted / row.total) * 100)
        : 0

      if (percent < 90) {
        await client.query("ROLLBACK")
        return res.status(403).json({
          message: "أكمل 90% من أنشطة الوحدة لفتح هذا الاختبار "
        })
      }

    }


    // -------------------------------
    // 3️⃣ Resume active attempt
    // -------------------------------
    const activeAttempt = await client.query(
      `SELECT *
       FROM exam_attempts
       WHERE user_id=$1
       AND exam_id=$2
       AND status='in_progress'
       LIMIT 1`,
      [user_id, exam_id]
    )

    if (activeAttempt.rows.length) {

      const attemptId = activeAttempt.rows[0].id

      const questions = await client.query(
        `SELECT q.id, q.question, q.options
         FROM exam_attempt_questions aq
         JOIN questions q ON q.id = aq.question_id
         WHERE aq.attempt_id=$1
         ORDER BY aq.order_index`,
        [attemptId]
      )

      await client.query("COMMIT")

      return res.json({
        message: "Resume attempt",
        attempt: activeAttempt.rows[0],
        questions: questions.rows
      })
    }


    // -------------------------------
    // 4️⃣ Check max attempts
    // -------------------------------
    const attemptCount = await client.query(
      `SELECT COUNT(*) AS count
       FROM exam_attempts
       WHERE user_id=$1 AND exam_id=$2`,
      [user_id, exam_id]
    )

    const attempts = Number(attemptCount.rows[0].count)

    if (attempts >= maxAttempts) {
      await client.query("ROLLBACK")
      return res.status(403).json({
        message: "تم الوصول إلى الحد الأقصى من المحاولات"
      })
    }


    const attemptNumber = attempts + 1


    // -------------------------------
    // 5️⃣ Create attempt
    // -------------------------------
    const newAttempt = await client.query(
      `INSERT INTO exam_attempts
       (user_id, exam_id, attempt_number, status, started_at)
       VALUES ($1,$2,$3,'in_progress',NOW())
       RETURNING *`,
      [user_id, exam_id, attemptNumber]
    )

    const attemptId = newAttempt.rows[0].id


    // -------------------------------
    // 6️⃣ Select random questions
    // -------------------------------
    const questionLimit = isFinal ? 20 : 10
    const questionUnitId = isFinal ? 0 : exam.unit_id

    const randomQuestions = await client.query(
      `SELECT id
       FROM questions
       WHERE unit_id = $1
       ORDER BY RANDOM()
       LIMIT $2`,
      [questionUnitId, questionLimit]
    )


    // -------------------------------
    // 7️⃣ Insert attempt questions
    // -------------------------------
    for (let i = 0; i < randomQuestions.rows.length; i++) {

      await client.query(
        `INSERT INTO exam_attempt_questions
         (attempt_id, question_id, order_index)
         VALUES ($1,$2,$3)`,
        [attemptId, randomQuestions.rows[i].id, i]
      )

    }


    // -------------------------------
    // 8️⃣ Load exam questions
    // -------------------------------
    const attemptQuestions = await client.query(
      `SELECT q.id, q.question, q.options
       FROM exam_attempt_questions aq
       JOIN questions q ON q.id = aq.question_id
       WHERE aq.attempt_id=$1
       ORDER BY aq.order_index`,
      [attemptId]
    )


    await client.query("COMMIT")


    return res.json({
      message: "Start attempt",
      attempt: newAttempt.rows[0],
      questions: attemptQuestions.rows
    })


  } catch (err) {

    await client.query("ROLLBACK")
    console.error(err)

    return res.status(500).json({
      error: "Server error"
    })

  } finally {

    client.release()

  }

})
module.exports = router;