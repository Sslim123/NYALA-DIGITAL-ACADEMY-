const express = require("express");
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require("../middleware/auth");
const supabase = require("../config/supabase");


router.post("/exams/submit", verifyToken, async (req, res) => {

  try {

    const { lesson_id, answers } = req.body;

    if (!lesson_id || !answers) {
      return res.status(400).json({ error: "Missing exam data" });
    }

    let fileName;

    if (lesson_id === "final-course") {
      fileName = "final-course.json";
    } else {
      fileName = `lesson-${lesson_id}.json`;
    }

    // download exam from Supabase
    const { data, error } = await supabase
      .storage
      .from("exam-json")
      .download(fileName);

    if (error) throw error;

    const text = await data.text();
    const exam = JSON.parse(text);

    const questions = exam.questions;

    let score = 0;

    questions.forEach(q => {

      const studentAnswer = answers.find(
        a => a.question_id === q.id
      );

      if (!studentAnswer) return;

      if (studentAnswer.selected === q.correct) {
        score++;
      }

    });

    const total = questions.length;

    const percentage = Math.round((score / total) * 100);

    const passed = percentage >= exam.pass_score;
    if (lesson_id === "final-course" && percentage >= exam.pass_score) {

      const code = `NYALA-${Date.now()}`;

      await pool.query(`
    INSERT INTO certificates (user_id, course_name, certificate_code)
    VALUES ($1,$2,$3)
  `, [
        req.user.id,
        "Digital Systems Foundations",
        code
      ]);

    }

    res.json({
      score,
      total: exam.questions.length,
      percentage,
      passed: percentage >= exam.pass_score,
      certificate: lesson_id === "final-course" && percentage >= exam.pass_score
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Exam evaluation failed"
    });

  }

});

module.exports = router;