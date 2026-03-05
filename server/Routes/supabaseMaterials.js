require('dotenv').config();
const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/auth');

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
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

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max)

router.post("/upload-free-course", verifyToken, upload.single("file"), async (req, res) => {

  try {

    const file = req.file
    const materialId = req.body.material_id;

    if (!file.mimetype.includes("pdf")) {
      return res.status(400).json({ error: "Only PDF allowed" })
    }

    // const filePath = `student-submissions/${materialId}/${file.originalname}`
    const filePath = `student-submissions${courseId}/unit-${unitId}/lesson-${lessonId}/${file.originalname}`;

    const { data, error } = await supabase
      .storage
      .from("student-submissions")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype
      })

    if (error) throw error

    res.json({
      message: "Upload successful",
      path: data.path
    })

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: "Upload failed" })

  }

})


module.exports = router;