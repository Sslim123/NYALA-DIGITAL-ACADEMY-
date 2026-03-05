const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const transporter = require('../config/emailServer')
const getApplyEmailTemplate = require('../utils/emailHelperApply');


const applyForm = async (req, res) => {
    const { name, email, track, password } = req.body;
    console.log("RAW BODY RECEIVED:", req.body);
    if (!password || password === 'temporary_default_pass') {
        console.warn("WARNING: Received default or empty password for:", email);
    }
    try {
        console.log("--- New Application ---");
        console.log("Plain Password received:", password); 
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

        console.log("Generated Hash:", hashedPassword); 
        const result = await pool.query(
            `INSERT INTO students (full_name, email, current_track, student_password) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, track, hashedPassword]);
        const newStudent = result.rows[0].student_id;

        const htmlBody = getApplyEmailTemplate(name, track);
        const mailOptions = {
            from: '"Nyala Digital Academy" <dayfansalem5@gmail.com>',
            to: email,
            subject: 'Application Received - Nyala Digital Academy',
            html: htmlBody
        }

        await transporter.sendMail(mailOptions);
        return res.status(201).json({ success: true, message: "Application sent!" });

    } catch (err) {
        console.error("DB Error:", err.message);
        return res.status(500).json({ success: false, message: "Database Error" })
    }
};
module.exports = { applyForm };