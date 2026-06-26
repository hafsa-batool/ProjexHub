require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"ProjexHub Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      html: "<h1>Test Successful!</h1><p>Your email configuration is working!</p>"
    });
    console.log("✅ Email sent! Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    console.log("Check your EMAIL_USER and EMAIL_PASS in .env file");
  }
}

testEmail();