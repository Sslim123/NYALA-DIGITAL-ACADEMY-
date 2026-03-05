const express = require('express');
const multer = require('multer');
const router = express.Router();
const pool = require('../config/db');
const fs = require('fs');
const verifyToken = require('../middleware/auth')



router.get('/all-courses-structure', verifyToken, async (req, res) => {
  try {
    const query = `
            SELECT 
                c.id AS course_id, c.name AS course_name, c.is_open,
                u.id AS unit_id, u.title AS unit_title,
                l.id AS lesson_id, l.title AS lesson_title, l.slides_info, l.objective
            FROM courses c
            LEFT JOIN units u ON c.id = u.course_id
            LEFT JOIN lessons l ON u.id = l.unit_id
            ORDER BY c.id, u.unit_order, l.id;
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "خطأ في جلب البيانات" });
  }
});

module.exports = router;