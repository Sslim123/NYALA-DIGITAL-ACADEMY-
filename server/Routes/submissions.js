// submissions.js

// مسؤول عن:

// رفع الواجب

// تسجيل submission

// عرض درجة الواجب بعد المراجعة
const express = require('express');
const multer = require('multer');
const router = express.Router();
const pool = require('../db');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/auth')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/submissions');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post(
  "/upload-free-course",
  verifyToken,
  upload.single("file"),
  async (req, res) => {

    try {
      const studentId = req.student.id;
      const lessonKey = req.body.lesson_key;
      console.log("DEBUG: Received lessonKey:", lessonKey);

      if (!lessonKey) {
        return res.status(400).json({ error: "lesson_key is missing from request" });
      }
    
// 1. Check if req.file exists first!
if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
}

// 2. Now check the mimetype using req.file
const isPdf = req.file.mimetype.includes("pdf");
const isWord = req.file.mimetype.includes("word") || req.file.mimetype.includes("officedocument");

if (!isPdf && !isWord) {
    return res.status(400).json({ message: "Invalid file type. Only PDF and Word allowed." });
}

// 3. Define your path
const filePath = `/uploads/submissions/${req.file.filename}`;



      const result = await pool.query(
        `
        INSERT INTO submissions 
        (student_id, lesson_key, file_path)
        VALUES ($1, $2, $3)
        ON CONFLICT ON CONSTRAINT unique_submission
        DO UPDATE SET 
        file_path = EXCLUDED.file_path,
        submitted_at = NOW();
        
        `,
        [studentId, lessonKey, filePath]
      );
      console.log("Values:", studentId, lessonKey, filePath);

      return res.json({
        message: "تم رفع الحل بنجاح",
        data: result.rows[0]
      });

    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      return res.status(500).json({ message: err.message });
    }
  }
);

router.get("/free-course-progress", verifyToken, async (req, res) => {
  try {

    const studentId = req.student.id;

    const result = await pool.query(
      `SELECT lesson_key FROM submissions WHERE student_id = $1`,
      [studentId]
    );

    const submissions = result.rows.map(r => r.lesson_key);

    const units = ["unit-1", "unit-2", "unit-3", "unit-4"];
    const unitProgress = {};
    const ITEMS_PER_UNIT = 9; // 3 lessons × 3 activities

    units.forEach(unit => {

      const unitActivities = submissions.filter(key =>
        key.startsWith(unit) &&
        !key.includes("final")
      );

      const finalSubmitted = submissions.includes(`${unit}-final`);

      const completedItems = unitActivities.length;

      let progress = 0;

      if (completedItems >= ITEMS_PER_UNIT) {
        progress = 90;
        if (finalSubmitted) {
          progress = 100;
        }
      } else {
        progress = Math.round((completedItems / ITEMS_PER_UNIT) * 90);
      }

      unitProgress[unit] = progress;

    });

    const courseProgress =
      Math.round(
        Object.values(unitProgress).reduce((a, b) => a + b, 0) /
        units.length
      );

    res.json({
      courseProgress,
      unitProgress
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Progress error" });
  }
});



module.exports = router;