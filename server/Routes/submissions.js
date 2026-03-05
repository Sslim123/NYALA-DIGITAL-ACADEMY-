const express = require('express');
const multer = require('multer');
const router = express.Router();
const pool = require('../config/db');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/auth');


const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
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

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max)

router.get("/units", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM units ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/lessons/:unitId", verifyToken, async (req, res) => {
  const { unitId } = req.params;
  if (!unitId || unitId === 'undefined') {
    return res.status(400).json({ error: "Unit ID is required" });
  }
  try {
    const result = await pool.query(
      "SELECT * FROM lessons WHERE unit_id = $1",
      [unitId]
    );
    console.log(result.rows)
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

router.get("/materials/:lessonId",verifyToken, async (req, res) => {

    const lessonId = req.params.lessonId

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
    const studentId = req.student.id;

    const result = await pool.query(`
      SELECT l.unit_id,
             COUNT(m.id) FILTER (
                WHERE l.is_final = false
                AND m.type IN ('lab','homework','assessment')
             ) AS total,
             COUNT(s.id) FILTER (
                WHERE l.is_final = false
                AND m.type IN ('lab','homework','assessment')
             ) AS submitted
      FROM lessons l
      LEFT JOIN materials m ON m.lesson_id = l.id
      LEFT JOIN submissions s
             ON s.material_id = m.id
             AND s.student_id = $1
      GROUP BY l.unit_id
    `, [studentId]);

    const progress = {};

    result.rows.forEach(row => {
      const percent =
        row.total > 0
          ? Math.round((row.submitted / row.total) * 100)
          : 0;

      progress[row.unit_id] = percent;
    });

    res.json(progress);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate progress" });
  }
});

module.exports = router;