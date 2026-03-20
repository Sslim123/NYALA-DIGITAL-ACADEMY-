const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const pool = require('../config/db')

const loginUser = async (req, res) => {


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

    if (student.status !== 'accepted') {
      return res.status(403).json({
        success: false,
        message: `Status is ${student.status}`
      });
    }

    const token = jwt.sign(
      {
        id: student.student_id,
        track: student.current_track
      },
      "SECRET_KEY",
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

  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

// if (!req.userId) {
//   return res.status(401).json({ error: "Not authenticated" });
// }
const setPassword = async (req, res) => {
 // const {email,  password } = req.body;
 //const idFromToken = req.user?.id || req.userId;
 
 console.log("Full Body:", req.body);
 const email = req.body.email;
 const password = req.body.password;
 if (!email) {
   return res.status(400).json({ error: "الإيميل مفقود من الطلب" });
  }
  console.log("البيانات القادمة:", { email, password }); // تأكد من رؤية الإيميل في الـ Terminal
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "بيانات غير مكتملة أو كلمة مرور قصيرة" });
  }
  try {
    const userCheck = await pool.query(
      `
      SELECT student_id, student_password
      FROM students
      WHERE email = $1
      `,
      [email.trim()]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "الطالب غير موجود" });
    }
    if (userCheck.rows[0].student_password) {
      return res.status(400).json({ error: "كلمة المرور تم تعيينها مسبقاً" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE students
      SET student_password= $1
      WHERE email = $2
      `,
      [hash, email.trim()]
    );

    res.json({ success: true, message: "تم تعيين كلمة المرور بنجاح" });
  } catch (err) {
    console.error("SET PASSWORD ERROR:", err);
    res.status(500).json({ error: "خطأ في السيرفر" });
  }
}

module.exports = { loginUser, setPassword };