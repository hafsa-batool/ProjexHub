// 🔥 BREVO HTTP API (No Nodemailer)
const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.EMAIL_PASS;
  const senderEmail = process.env.EMAIL_USER;

  const url = 'https://api.brevo.com/v3/smtp/email';

  const payload = {
    sender: { email: senderEmail, name: 'ProjexHub' },
    to: [{ email: to }],
    subject: subject,
    htmlContent: html
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('✅ Email sent via Brevo API to:', to);
      return true;
    } else {
      const errorData = await response.json();
      console.error('❌ Brevo API error:', errorData.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Email exception:', error.message);
    return false;
  }
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const html = `
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333;">Welcome to ProjexHub!</h2>
      <p>Click the button below to verify your email:</p>
      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0;">Verify Email</a>
      <p style="color: #999; font-size: 12px;">Or copy this link: ${url}</p>
    </div>
  `;
  return await sendEmail(email, 'Verify Your ProjexHub Account', html);
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const html = `
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0;">Reset Password</a>
      <p style="color: #999; font-size: 12px;">This link expires in 1 hour.</p>
    </div>
  `;
  return await sendEmail(email, 'Reset Your ProjexHub Password', html);
};

const sendClientInvitationEmail = async (email, token, adminName) => {
  const acceptUrl = `${process.env.CLIENT_URL}/accept-invite/${token}`;
  const html = `
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333;">You've been invited to ProjexHub!</h2>
      <p><strong>${adminName}</strong> has added you as a client.</p>
      <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0;">Accept Invitation</a>
    </div>
  `;
  return await sendEmail(email, `Invitation to join ProjexHub from ${adminName}`, html);
};

module.exports = { 
  sendEmail, 
  sendVerificationEmail, 
  sendResetPasswordEmail, 
  sendClientInvitationEmail 
};