const express = require("express")
const router = express.Router()
const pool = require("../../config/db")
const QRCode = require("qrcode");
const verifyToken = require("../../middleware/auth");

router.post("/generate/certificate", verifyToken, async (req, res) => {
  const { course_id, course_name } = req.body;
  const user_id = req.user.id

  try {
    const student = await pool.query(

      `select full_name from students where student_id = $1`, [user_id]

    )
    if (!student.rowCount.length) {
      return res.status(404).json({ error: "student not found" })
    }
    const student_name = student.rows[0].full_name

    const certificate_code = "NYALA-" + Date.now()

    const result = await pool.query(
      `INSERT INTO certificates
      (user_id, course_id, student_name, course_name, certificate_code)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [user_id, course_id, student_name, course_name, certificate_code]
    )

    const verifyURL =
      `http://192.168.0.8:3000/verify/${certificate_code}`

    const qr = await QRCode.toDataURL(verifyURL)

    res.json({
      certificate: result.rows[0],
      qr_code: qr
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }

});
router.get("/verify/:code", verifyToken, async (req, res) => {

  const { code } = req.params

  try {

    const result = await pool.query(
      "SELECT * FROM certificates WHERE certificate_code=$1",
      [code]
    )

    if (result.rows.length === 0) {
      return res.json({
        valid: false
      })
    }

    res.json({
      valid: true,
      certificate: result.rows[0]
    })

  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }

})

module.exports = router