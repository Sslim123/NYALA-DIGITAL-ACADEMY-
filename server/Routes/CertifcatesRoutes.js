
const express = require("express");
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require("../middleware/auth");
const PDFDocument = require("pdfkit");
//const supabase = require("../config/supabase");




router.get("/certificate/download", verifyToken, async (req, res) => {

  try {

    const cert = await pool.query(`
      SELECT * FROM certificates
      WHERE user_id = $1
      ORDER BY issued_at DESC
      LIMIT 1
    `,[req.user.id]);

    if (!cert.rows.length) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const certificate = cert.rows[0];

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    res.setHeader("Content-Type","application/pdf");

    doc.pipe(res);

    doc.fontSize(28)
       .text("Certificate of Completion",100,150);

    doc.fontSize(18)
       .text(`Awarded to Student ID ${req.user.id}`,100,220);

    doc.text("Digital Systems Foundations",100,260);

    doc.text(`Certificate Code: ${certificate.certificate_code}`,100,300);

    doc.text(`Issued: ${certificate.issued_at}`,100,340);

    doc.end();

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Certificate generation failed"
    });

  }

});
router.get("/certificate", verifyToken, async (req,res)=>{

 const cert = await pool.query(`
   SELECT * FROM certificates
   WHERE user_id = $1
   ORDER BY issued_at DESC
   LIMIT 1
 `,[req.user.id]);

 if(!cert.rows.length){
   return res.status(404).json({error:"No certificate"});
 }

 res.json(cert.rows[0]);

});
module.exports = router;