const express = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { Pool } = require('pg'); // This talks to PostgreSQL
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const nodemailer = require('nodemailer');
const testBcrypt = async () => {
    const pass = "cisco";
    const hash = await bcrypt.hash(pass, 10);
    const isMatch = await bcrypt.compare(pass, hash);
    console.log("--- BCRYPT SYSTEM TEST ---");
    console.log("Password: 'cisco'");
    console.log("Generated Hash:", hash);
    console.log("Internal System Match:", isMatch);
};
testBcrypt();
// 1. Create the Transporter (The "Mailman")
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // looks for your email in .env
    pass: process.env.EMAIL_PASS, // looks for your app pass in .env
  }
});

// 1. Connect to your Pioneer_DB
const pool = new Pool({
  user: process.env.DB_USER,      
  host: process.env.DB_HOST,      
  database: process.env.DB_NAME,  
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// 2. The "Listener" for the Apply Form
app.post('/api/apply', async (req, res) => {
  const { name, email, track, password } = req.body;
  console.log("RAW BODY RECEIVED:", req.body);
  if (!password || password === 'temporary_default_pass') {
      console.warn("WARNING: Received default or empty password for:", email);
  }
  try {
    console.log("--- New Application ---");
    console.log("Plain Password received:", password); // Should be 'cisco'
    const saltRounds = 10;
    // In api/apply
const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

    console.log("Generated Hash:", hashedPassword); // Should start with $2b$10$...
    const result = await pool.query(
      `INSERT INTO students (full_name, email, current_track, student_password) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, track, hashedPassword]);
    const newStudent = result.rows[0].student_id;
    // 2. Email Action - Use 'name' and 'track' from req.body
    const mailOptions = {
      from: '"Pioneer Digital Academy" <dayfansalem5@gmail.com>',
      to: email,
      subject: 'Application Received - Pioneer Digital Academy',
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px;">
            <div style="text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                <h2 style="color: #007bff;">Pioneer Digital Academy</h2>
                
                </div>
                <div style="padding: 20px 0;">
                <p>Hello <strong>${name}</strong>,</p>
                <p>Thank you for applying to the <strong>${track}</strong> track! We have received your application and it is currently <strong>Pending Review</strong>.</p>
                <p>What's next? Our team in Nyala will review your details. You will receive another email once a decision is made.</p>
                </div>
                <div style="background: #f8f9fa; padding: 15px; font-size: 12px; color: #666;">
                <p><strong>Contact Us:</strong></p>
                <p>📍 Nyala, South Darfur | 📞 +249 123 456 789</p>
                <img src="https://res.cloudinary.com" alt="NDA Logo" style="width: 150px;">
            </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Mail Error:", error);
      else console.log("Mail Success:", info.response);
    });
    // 3. Send ONLY ONE response to the frontend
    return res.status(201).json({ success: true, message: "Application sent!" });

  } catch (err) {
    console.error("DB Error:", err.message);
    // Use 'return' to ensure we stop here
    return res.status(500).json({ success: false, message: "Database Error" });
  }
});
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body  
  if (!password || !email) {
    return res.status(400).json({ success: false, message: "Email and Password are required." });
  }
  try {
    const userResult = await pool.query('SELECT * FROM students WHERE email = $1', [email.trim()]);
    console.log("Input Email:", email);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Account not found." });
    }

const inputPassword = req.body.password.toString().trim();
const student = userResult.rows[0];

const isMatch = await bcrypt.compare(inputPassword, student.student_password.trim());
console.log(`Login Attempt for ${email}: Match = ${isMatch}`);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }
    //Check status
    if (student.status !== 'accepted') {
      return res.status(403).json({ success: false, message: `Status is ${student.status}` });
    }
    // 2. CHECK THE STATUS (The Gatekeeper)
    if (student.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: "Your application is still pending. Please wait for an approval email."
      });
    }

    if (student.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: "We regret to inform you that your application was not accepted."
      });
    }

    // 3. If they reach here, they are 'accepted'!
    return res.json({
      success: true,
      message: "Welcome to the Academy!",
      user: { name: student.full_name, track: student.current_track }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Get all students for the Admin Dashboard
app.get('/api/students', async (req, res) => {
  try {
    const allStudents = await pool.query(
      'SELECT student_id, full_name, email, current_track, status, enrollment_date FROM students ORDER BY enrollment_date DESC'
    );
    res.json(allStudents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Update student status (Accept/Reject)
app.patch('/api/students/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expecting 'accepted' or 'rejected'
  console.log("1. Update requested for ID:", req.params.id); // Check terminal

  try {
    const result = await pool.query(
      'UPDATE students SET status = $1 WHERE student_id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = result.rows[0];
    // Inside your app.patch route...
    const statusMessage = status === 'accepted'
      ? `
        <p>Congratulations! Your application has been <strong>Accepted</strong>.</p>
        <p>Your student account is now <strong>Active</strong>. You can now log in to the Student Portal to access your materials.</p>
        <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Username:</strong> ${student.email}</p>
            <p style="margin: 0;"><strong>Password:</strong> (The password you chose during application)</p>
        </div>
        <a href="http://localhost:3000/login" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to Student Portal</a>
      `
      : `<p>We regret to inform you that your application for ${student.current_track} was not accepted at this time.</p>`;

    const mailOptions = {
      from: 'dayfansalem5@gmail.com',
      to: student.email,
      subject: `Update on your Application: ${status.toUpperCase()}`,
      text: `Hello ${student.full_name},\n\nYour application for ${student.current_track} has been ${statusMessage}.`
    };

    transporter.sendMail(mailOptions);

    res.json({ success: true, student: student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get materials based on the student's track
app.get('/api/materials/:track', async (req, res) => {
  const { track } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM materials WHERE track = $1 ORDER BY unit_number ASC',
      [track]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching materials');
  }
});

app.listen(5000, () => console.log("Bridge running on port 5000"));