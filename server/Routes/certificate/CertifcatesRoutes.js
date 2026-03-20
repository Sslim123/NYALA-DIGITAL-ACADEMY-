
const express = require("express");
const router = express.Router();
const pool = require('../../config/db');
const { v4: uuidv4 } = require("uuid")
const verifyToken = require("../../middleware/auth");
const PDFDocument = require("pdfkit");




router.get("/certificate/download", verifyToken, async (req, res) => {
  try {

    const cert = await pool.query(
      `SELECT 
      certificates.*,
      students.full_name AS full_name
FROM certificates
JOIN students ON students.student_id = certificates.user_id
WHERE certificates.user_id = $1
ORDER BY certificates.issued_at DESC
LIMIT 1`
      , [req.user.id]);

    if (!cert.rows.length) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const certificate = cert.rows[0];

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(28)
      .text("Certificate of Completion", 100, 150);

    doc.fontSize(18)
      .text(`Awarded to Student ID ${certificate.full_name}`, 100, 220);

    doc.text("Digital Systems Foundations", 100, 260);
    doc.text(`Certificate Code: ${certificate.certificate_code}`, 100, 300);

    doc.text(`Issued: ${certificate.issued_at}`, 100, 340);
    doc.moveTo(400, 400)
      .lineTo(520, 400)
      .stroke();

    doc.image("signature.png", 400, 360, { width: 120 });
    doc.fontSize(14)
      .text("Program Manager", 400, 410);

    doc.end();

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Certificate generation failed"
    });

  }

});
// router.get("/certificate", verifyToken, async (req, res) => {
//   const existing = await pool.query(`
// SELECT * FROM certificates
// WHERE user_id=$1 AND course_name=$2
// `,
//     [req.user.id, "Digital Systems Foundations"]);
//   if (existing.rows.length) {
//     return res.json(existing.rows[0])
//   }
//   try {

//     const certificate_code = uuidv4()

//     const cert = await pool.query(`
//       INSERT INTO certificates
//       (user_id, course_name, certificate_code, issued_at)
//       VALUES ($1,$2,$3,NOW())
//       RETURNING *
//     `,
//       [
//         req.user.id,
//         "Digital Systems Foundations",
//         certificate_code
//       ])

//     res.json(cert.rows[0])

//   } catch (err) {

//     console.error("certificate error:", err)

//     res.status(500).json({
//       error: "certificate generation failed"
//     })

//   }
router.get("/certificate", verifyToken, async (req, res) => {

  try {

    const cert = await pool.query(
      `SELECT 
        certificates.*,
        students.full_name
       FROM certificates
       JOIN students 
       ON students.student_id = certificates.user_id
       WHERE certificates.user_id = $1
       ORDER BY certificates.issued_at DESC
       LIMIT 1`,
      [req.user.id]
    )

    if (!cert.rows.length) {
      return res.status(404).json({
        error: "No certificate found"
      })
    }

    res.json(cert.rows[0])

  } catch (err) {

    console.error("certificate error:", err)

    res.status(500).json({
      error: "certificate retrieval failed"
    })

  }

})
module.exports = router;