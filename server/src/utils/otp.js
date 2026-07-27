const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async (email, otp) => {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  if (!email) {
    console.error('[EMAIL ERROR] No recipient email address provided.');
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">CivicWatch Email Verification</h2>
      <p style="color: #475569;">Your one-time verification passcode (OTP) is:</p>
      <h1 style="color: #0284c7; letter-spacing: 6px; font-size: 32px;">${otp}</h1>
      <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  // 1. Try Gmail App Password via Nodemailer
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER.trim(),
          pass: process.env.EMAIL_PASSWORD.trim()
        }
      });

      await transporter.sendMail({
        from: `"CivicWatch" <${process.env.EMAIL_USER.trim()}>`,
        to: email,
        subject: 'CivicWatch Email Verification OTP',
        html: htmlContent
      });

      console.log(`[GMAIL SUCCESS] OTP email dispatched to ${email}`);
      return true;
    } catch (err) {
      console.error(`[GMAIL ERROR] Failed to send email to ${email}:`, err.message);
    }
  }

  // Fallback: If no email credentials are configured or email fails, print OTP code in server logs so signups are not blocked
  console.log(`[EMAIL FALLBACK] OTP Code for ${email} is: ${otp}`);
  return true;
};

module.exports = {
  generateOtp,
  sendOtpEmail
};

