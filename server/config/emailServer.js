require('dotenv').config();
const bcrypt = require('bcryptjs');
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
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  }
});
transporter.verify((error, success) => {
    if (error) {
        console.log("Mail Server Error:", error);
    } else {
        console.log("Mail Server is ready to take messages", success);
    }
});
module.exports = transporter;