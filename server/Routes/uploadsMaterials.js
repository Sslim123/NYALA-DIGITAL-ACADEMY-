require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pool = require('../config/db');
const router = express.Router();
const supabase = require("../config/supabase");
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/auth');

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
const storage = multer.memoryStorage()
  const upload = multer({storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max)
router.post("/upload-free-course", verifyToken, upload.single("file"), async (req, res) => {

  try {

    const file = req.file
    const materialId = req.body.material_id;
if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!file.mimetype.includes("pdf")) {
      return res.status(400).json({ error: "Only PDF allowed" })
    }

    const filePath = `student-submissions/${materialId}/${file.originalname}`
    const { data, error } = await supabase
      .storage
      .from("student-submissions")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      })

    if (error) throw error
    await pool.query(
      `
  INSERT INTO submissions
  (user_id, material_id, file_path, submitted_at)
  VALUES ($1,$2,$3,NOW())
  `,
      [req.user.id, materialId, data.path]
    );

    res.json({
      message: "Upload successful",
      path: data.path
    });

  } catch (err) {

    console.error("error failed :", err.message)
    res.status(500).json({ error: "Upload failed" })

  }

})


module.exports = router;