
const express = require("express");
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require("../middleware/auth");
//const supabase = require("../config/supabase");

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