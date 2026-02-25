const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db"); // عدل حسب مسار الاتصال بقاعدة البيانات

// إعداد التخزين الديناميكي
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { courseId, unitId, lessonId } = req.body;

    const uploadPath = path.join(
      __dirname,
      "..",
      "uploads",
      `course-${courseId}`,
      `unit-${unitId}`,
      `lesson-${lessonId}`
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// رفع ملف جديد
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { lessonId, type, title, courseId, unitId } = req.body;

    const filePath = `/uploads/course-${courseId}/unit-${unitId}/lesson-${lessonId}/${req.file.filename}`;

    await db.query(
      `INSERT INTO materials (lesson_id, title, type, file_name, file_path)
       VALUES (?, ?, ?, ?, ?)`,
      [lessonId, title, type, req.file.filename, filePath]
    );

    res.json({ message: "تم رفع الملف بنجاح", filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء رفع الملف" });
  }
});

// جلب مواد درس معين
router.get("/lesson/:lessonId", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM materials WHERE lesson_id = ?`,
      [req.params.lessonId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المواد" });
  }
});

module.exports = router;
