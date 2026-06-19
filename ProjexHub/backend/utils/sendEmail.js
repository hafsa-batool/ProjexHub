const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Main sendEmail function
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"ProjexHub" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    });
    console.log('✅ Email sent to:', to);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const html = `
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333;">Welcome to ProjexHub!</h2>
      <p>Click the button below to verify your email:</p>
      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0;">Verify Email</a>
      <p style="color: #999; font-size: 12px;">Or copy this link: ${url}</p>
      <p style="color: #999; font-size: 12px;">This link expires in 24 hours.</p>
    </div>
  `;
  return await sendEmail(email, 'Verify Your ProjexHub Account', html);
};

// Send reset password email
const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const html = `
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0;">Reset Password</a>
      <p style="color: #999; font-size: 12px;">Or copy this link: ${url}</p>
      <p style="color: #999; font-size: 12px;">This link expires in 1 hour.</p>
    </div>
  `;
  return await sendEmail(email, 'Reset Your ProjexHub Password', html);
};

// Send client invitation email
const sendClientInvitationEmail = async (email, token, adminName) => {
  const acceptUrl = `${process.env.CLIENT_URL}/accept-invite/${token}`;
  const html = `
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333;">You've been invited to ProjexHub!</h2>
      <p><strong>${adminName}</strong> has added you as a client.</p>
      <p>Click the button below to create your account and get started:</p>
      <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0;">Accept Invitation</a>
      <p style="color: #999; font-size: 12px;">Or copy this link: ${acceptUrl}</p>
      <p style="color: #999; font-size: 12px;">This link expires in 7 days.</p>
      <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  return await sendEmail(email, `Invitation to join ProjexHub from ${adminName}`, html);
};

// Export all functions
module.exports = { 
  sendEmail, 
  sendVerificationEmail, 
  sendResetPasswordEmail, 
  sendClientInvitationEmail 
};