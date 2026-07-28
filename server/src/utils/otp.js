const nodemailer = require('nodemailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser.trim(),
      pass: emailPass.trim()
    }
  });
};

const sendOtpEmail = async (email, otp) => {
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    console.error('[EMAIL ERROR] Invalid or missing recipient email address.');
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

  const transporter = getTransporter();

  if (transporter) {
    try {
      const mailOptions = {
        from: `"CivicWatch" <${process.env.EMAIL_USER.trim()}>`,
        to: email.trim().toLowerCase(),
        subject: 'CivicWatch Email Verification OTP',
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log(`[NODEMAILER SUCCESS] OTP email successfully sent to ${email}`);
      return true;
    } catch (err) {
      console.error(`[NODEMAILER ERROR] ${err.message}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[NODEMAILER DEV FALLBACK] OTP Code for ${email} is: ${otp}`);
        return true;
      }
      return false;
    }
  }

  // Development Fallback: Log to console when credentials are missing
  console.log(`[NODEMAILER FALLBACK] OTP Code for ${email} is: ${otp}`);
  return true;
};

module.exports = {
  generateOtp,
  sendOtpEmail
};
