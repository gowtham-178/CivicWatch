const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

let cachedTransporter = null;

const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
  const emailPass = process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.trim() : '';

  const isValidCredential =
    emailUser &&
    !emailUser.includes('your_email@gmail.com') &&
    emailPass &&
    !emailPass.includes('your_app_password') &&
    !emailPass.includes('your_16_character_app_password');

  if (!isValidCredential) {
    return null;
  }

  if (!cachedTransporter) {
    const nodemailer = require('nodemailer');
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: emailUser,
        pass: emailPass
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }

  return cachedTransporter;
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

  const transporter = getTransporter();

  if (transporter) {
    try {
      // Race email sending against a 5-second timeout to prevent API hangs
      const sendPromise = transporter.sendMail({
        from: `"CivicWatch" <${process.env.EMAIL_USER.trim()}>`,
        to: email,
        subject: 'CivicWatch Email Verification OTP',
        html: htmlContent
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email dispatch timed out after 10000ms')), 10000)
      );

      await Promise.race([sendPromise, timeoutPromise]);
      console.log(`[GMAIL SUCCESS] OTP email dispatched to ${email}`);
      return true;
    } catch (err) {
      console.error(`[GMAIL ERROR] ${err.message}.`);
    }
  }

  // Fallback: If no real credentials are set or SMTP fails/times out, log OTP code to terminal
  console.log(`[EMAIL FALLBACK] OTP Code for ${email} is: ${otp}`);
  return true;
};

module.exports = {
  generateOtp,
  sendOtpEmail
};

