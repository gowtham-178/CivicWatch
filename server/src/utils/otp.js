const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Generates a random 6-digit numerical OTP string.
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends OTP verification email to recipient.
 */
const sendOtpEmail = async (email, otp) => {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  if (!email) {
    console.log(`\n======================================================\n🔑 [DEVELOPMENT OTP] Phone signup. Generated OTP: ${otp}\n======================================================\n`);
    return true;
  }

  const hasRealCredentials =
    process.env.EMAIL_USER &&
    !process.env.EMAIL_USER.includes('your_email@gmail.com') &&
    process.env.EMAIL_PASSWORD &&
    !process.env.EMAIL_PASSWORD.includes('your_app_password');

  // Always log OTP to server console for instant local development & debugging
  console.log(`\n======================================================\n🔑 [CIVICWATCH OTP] Verification Code for ${email}: ${otp}\n======================================================\n`);

  if (!hasRealCredentials) {
    console.log(`[SMTP NOTICE] Real email credentials not set in server/.env (EMAIL_USER / EMAIL_PASSWORD). Using terminal console OTP above.`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"CivicWatch" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'CivicWatch Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">CivicWatch Email Verification</h2>
          <p style="color: #475569;">Your one-time verification passcode (OTP) is:</p>
          <h1 style="color: #0284c7; letter-spacing: 6px; font-size: 32px;">${otp}</h1>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      `
    });
    console.log(`[SMTP SUCCESS] Real OTP email sent successfully to ${email}`);
    return true;
  } catch (err) {
    console.error('[SMTP ERROR] Email dispatch failed:', err.message);
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.log(`[DEVELOPMENT FALLBACK] Email failed. Use terminal console OTP above.`);
      return true;
    }
    return false;
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail
};

