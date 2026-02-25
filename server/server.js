require('dotenv').config();
const express = require('express');
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const pool = require('./db');
const cors = require('cors');
const courseRoutes = require('./Routes/CourseRoutes.js');
const materialsRoutes = require("./Routes/Materials.js");
const coursesRoutes = require("./Routes/courses.js");
const submissionsRoutes = require("./Routes/submissions.js")
const freeCourseStructure = require("./Routes/freeCourseStructure");
//const progressRoutes = require("./Routes/CourseRoutes.js")



const app = express();
const path = require('path');
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)

app.use(express.json());
app.use(
  session({
    name: "seb.sid",
    secret: "seb-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    },
  })
);
app.use('/api/courses', courseRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/courses", coursesRoutes);
app.use("/api/materials", materialsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/submissions", submissionsRoutes);
app.use("/api/courses", freeCourseStructure);

//app.use("api/progress", progressRoutes);


app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
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
src="https://res.cloudinary.com/dndvxb9hk/image/upload/v1770707447/nyala-academy-logo_tudtwu.png"
                  alt="Logo" width="auto" height="100px"/>
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

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required."
    });
  }

  try {

    const userResult = await pool.query(
      'SELECT * FROM students WHERE email = $1',
      [email.trim()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Account not found."
      });
    }

    const student = userResult.rows[0];

    const isMatch = await bcrypt.compare(
      password.trim(),
      student.student_password.trim()
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password."
      });
    }

    // Check status
    if (student.status !== 'accepted') {
      return res.status(403).json({
        success: false,
        message: `Status is ${student.status}`
      });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      {
        id: student.student_id,
        track: student.current_track
      },
      "SECRET_KEY",   // لاحقاً ننقلها إلى .env
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Welcome to the Academy!",
      token,
      user: {
        id: student.student_id,
        name: student.full_name,
        track: student.current_track
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
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
src="https://res.cloudinary.com/dndvxb9hk/image/upload/v1770707447/nyala-academy-logo_tudtwu.png"
                  alt="Logo" width="auto" height="100px"/>
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

// Get materials based on the student's 
app.get('/api/materials', async (req, res) => {
  //console.log("SESSION:", req.session);
  console.log("SESSION DATA:", req.session);
  if (!req.session.userId) {
    console.log("SESSION INSIDE MATERIALS:", req.session);
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM materials ORDER BY track, unit_number ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching materials');
  }
});

// access to free course after token create sessons 

app.post("/api/auth/token-login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    const result = await pool.query(
      `
      SELECT id, password_set
      FROM users
      WHERE access_token = $1
      AND free_access_enabled = true
      `,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = result.rows[0];

    // 🔑 إنشاء session
    req.session.userId = user.id;

    // 🎯 القرار
    res.json({
      success: true,
      next:
        user.password_set === true
          ? "/free-course"
          : "/set-password",
    });
  } catch (err) {
    console.error("TOKEN LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// app.get("/api/free-course-access", (req, res) => {
//   if (!req.session.userId) {
//     return res.status(401).json({ access: false });
//   }
//   res.json({ access: true });
// });
app.post("/api/set-password", async (req, res) => {
  try {
    // 1️⃣ تحقق من session
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password too short" });
    }
    // 2️⃣ تأكد أن كلمة المرور لم تُضبط من قبل
    const userCheck = await pool.query(
      `
      SELECT password_set
      FROM users
      WHERE id = $1
      `,
      [req.session.userId]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    if (userCheck.rows[0].password_set) {
      return res.status(400).json({ error: "Password already set" });
    }

    // 3️⃣ Hash password
    const hash = await bcrypt.hash(password, 10);

    // 4️⃣ Update password + invalidate token
    await pool.query(
      `
      UPDATE users
      SET password_hash = $1,
          password_set = true,
          access_token = NULL
      WHERE id = $2
      `,
      [hash, req.session.userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("SET PASSWORD ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const result = await pool.query(
    `
    SELECT id, password_hash
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  req.session.userId = user.id;
  res.json({ success: true });
});

app.get("/api/me", async (req, res) => {
  if (!req.session.userId) {
    return res.json({ loggedIn: false });
  }
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      free_access_enabled
    FROM users
    WHERE id = $1
    `,
    [req.session.userId]
  );

  if (result.rows.length === 0) {
    return res.json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    user: result.rows[0],
  });
});


app.listen(5000, () => console.log("Bridge running on port 5000"));