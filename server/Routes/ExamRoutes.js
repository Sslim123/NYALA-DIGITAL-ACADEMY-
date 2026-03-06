const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const verifyToken = require("../middleware/auth");


router.get("/exams/:lessonId", verifyToken, async (req, res) => {

  try {

    const lessonId = req.params.lessonId;

    const fileName = `unit${lessonId}.json`;
const progress = await getStudentProgress(req.user.id, lessonId);

if (progress < 70) {
  return res.status(403).json({ error: "Exam locked" });
}
    const { data, error } = await supabase
      .storage
      .from("exam-json")
      .download(fileName);

    if (error) throw error;

    const text = await data.text();
    const exam = JSON.parse(text);

    res.json(exam);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Exam not found" });

  }

});
module.export = router;