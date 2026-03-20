
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); 
const verifyToken = require("../middleware/auth");


router.get("/student-courses", verifyToken, async (req, res) => {

  try {

    const studentId = req.user.id;

    const studentResult = await pool.query(
      "SELECT current_track FROM students WHERE student_id = $1",
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const track = studentResult.rows[0].current_track;

    const coursesResult = await pool.query(
      "SELECT id, name, track FROM courses",
      console.log("Student Track:", track)
    );
    //console.log("All Courses:", coursesResult.rows);

    res.json(coursesResult.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

});

module.exports = router;
