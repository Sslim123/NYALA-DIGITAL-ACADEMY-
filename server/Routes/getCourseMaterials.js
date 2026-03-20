const express = require('express');
const multer = require('multer');
const router = express.Router();
const pool = require('../config/db');
const supabase = require('../config/supabase')
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/auth');

console.log("SUPABASE_URL: 2", process.env.SUPABASE_URL);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

//const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max)

router.get("/units", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM units ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/lessons/:unitId/", verifyToken, async (req, res) => {
  const { unitId } = req.params;

  if (!unitId || unitId === 'undefined') {
    return res.status(400).json({ error: "Unit ID is required" });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM lessons WHERE unit_id = $1",
      [unitId]
    );
    //console.log(result.rows)
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});
router.get("/exam/by-lesson/:lessonId", verifyToken, async (req, res) => {

  const { lessonId } = req.params;

  try {

    const lesson = await pool.query(
      "SELECT unit_id FROM lessons WHERE id = $1",
      [lessonId]
    );

    if (!lesson.rows.length) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    const unitId = lesson.rows[0].unit_id;

    const exam = await pool.query(
      "SELECT id FROM exams WHERE unit_id = $1",
      [unitId]
    );

    if (!exam.rows.length) {
      return res.status(404).json({ error: "Exam not found for this unit" });
    }

    res.json({ exam_id: exam.rows[0].id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/materials/:lessonId/", verifyToken, async (req, res) => {
  const { lessonId } = req.params
  const materials = await pool.query(
    "SELECT * FROM materials WHERE lesson_id = $1",
    [lessonId]
  )
  const result = materials.rows.map(mat => {
    const { data } = supabase
      .storage
      .from("free-course-materials")
      .getPublicUrl(mat.file_path)
    return {
      ...mat,
      url: data.publicUrl
    }
  })

  res.json(result)
})

router.get("/free-course-progress", verifyToken, async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await pool.query(`
      SELECT
        l.unit_id,
        COUNT(DISTINCT m.id) FILTER (
          WHERE m.type IN ('lab','homework','assessment')
          AND l.is_final = false
        ) AS total,

        COUNT(DISTINCT s.material_id) FILTER (
          WHERE m.type IN ('lab','homework','assessment')
          AND l.is_final = false
        ) AS submitted

      FROM lessons l
      LEFT JOIN materials m ON m.lesson_id = l.id
      LEFT JOIN submissions s
        ON s.material_id = m.id
        AND s.user_id = $1

      GROUP BY l.unit_id
      ORDER BY l.unit_id
    `, [userId]);
    
    const units = {};    
    result.rows.forEach(row => {
      const total = Number(row.total);
      const submitted = Number(row.submitted);
      const percent =
        row.total > 0
          ? Math.round((submitted / total) * 100)
          : 0;
      units[row.unit_id] = {
        progress: percent,
        examUnlocked: percent>= 70
      };
    });
    console.log("Progress rows:", result.rows);
    const progressValues = Object.values(units).map(u => u.progress);

    const courseProgress =
      progressValues.length > 0
        ? Math.round(
          progressValues.reduce((a, b) => a + b, 0) / progressValues.length
        )
        : 0;
    res.json({
      units,
      courseProgress
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Failed to calculate progress" });

  }
});


module.exports = router;