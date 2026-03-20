require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pool = require('../config/db');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get("/materials/:id/download", verifyToken, async (req, res) => {
  const userId = req.user.id
  const materialId = req.params.id
  try {
    await pool.query(`
      INSERT INTO material_downloads (student_id, material_id)
      VALUES ($1,$2)
      ON CONFLICT (student_id, material_id) DO NOTHING
    `,[userId, materialId])
    const material = await pool.query(
      "SELECT file_url FROM materials WHERE id=$1",
      [materialId]
    )
    if(!material.rows.length){
      return res.status(404).json({error:"Material not found"})
    }
    res.redirect(material.rows[0].file_url)
  } catch(err){
    console.error(err)
    res.status(500).json({error:"Download failed"})
  }
})
module.exports = router;