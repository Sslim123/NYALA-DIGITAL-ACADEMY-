const express = require("express");
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require("../middleware/auth");
const supabase = require("../config/supabase");


router.post("/exams/submit", verifyToken, async (req, res) => {
  console.log("User from token:", req.user);
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
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        error: "Answers must be an array"
      });
    }

    console.log("Answers received:", answers.length);
    // download exam from Supabase
    const { data, error } = await supabase
      .storage
      .from("exam-json")
      .download(fileName);
    if (error) throw error;

    const text = await data.text();
    const exam = JSON.parse(text);

    // const questions = exam.questions;
    const questions = Array.isArray(exam.questions) ? exam.questions : [];

    if (questions.length === 0) {
      return res.status(500).json({
        error: "Exam questions not loaded correctly"
      });
    }
    console.log("Questions loaded:", questions.length);
    // const questions = exam.questions.filter(
    //   q => q && q.id !== undefined
    // );
    let score = 0;
    for (const q of questions) {

      if (!q || typeof q.id === "undefined") continue;

      const studentAnswer = answers.find(
        a => a && a.question_id === q.id
      );

      if (studentAnswer && studentAnswer.selected === q.correct) {
        score++;
      }

    }

    console.log("Received answers:", answers);
    const total = questions.length;

    const percentage = Math.round((score / total) * 100);

    const passed = percentage >= exam.pass_score;
    if (lesson_id === "final-course" && percentage >= exam.pass_score) {

      const code = `NYALA-${Date.now()}`;
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          error: "User not authenticated"
        });
      }
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