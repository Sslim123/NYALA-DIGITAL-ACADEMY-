const pool = require('../config/db');
const transporter = require('../config/emailServer');
const getStatusEmailTemplate = require('../utils/emailHelperStatus');


const AdminDashboard = async (req, res) => {
  try {
    const allStudents = await pool.query(
      'SELECT student_id, full_name, email, current_track, status, enrollment_date FROM students ORDER BY enrollment_date DESC'
    );
    res.json(allStudents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
const StudentUpdateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 
  console.log("1. Update requested for ID:", req.params.id); 

  try {
    const result = await pool.query(
      'UPDATE students SET status = $1 WHERE student_id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = result.rows[0];

    const htmlBody = getStatusEmailTemplate(student, status);

    const mailOptions = {
      from: '"Nyala Digital Academy" <dayfansalem5@gmail.com>',
      to: student.email,
      subject: `Update on your Application: ${status.toUpperCase()}`,
      html: htmlBody 
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Status updated and email sent!" });

  } catch (err) {
    console.error("Critical Error:", err.message);
    res.status(500).json({ error: "Failed to update or send email" });
  }
};
module.exports = { StudentUpdateStatus, AdminDashboard };