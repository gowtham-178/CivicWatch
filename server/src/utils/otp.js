const nodemailer = require('nodemailer');

/**
 * Generate a 6-digit numeric OTP code
 * @returns {string} 6-digit OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

let cachedTransporter = null;

/**
 * Get or initialize Nodemailer transporter instance
 * @returns {import('nodemailer').Transporter | null}
 */
const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;

  if (!cachedTransporter) {
    const service = process.env.EMAIL_SERVICE || 'gmail';
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
    const secure = process.env.EMAIL_SECURE === 'true';

    const transportOptions = host
      ? {
        host,
        port,
        secure,
        auth: {
          user: emailUser,
          pass: emailPass
        },
        connectionTimeout: 15000,
        socketTimeout: 15000
      }
      : {
        service,
        auth: {
          user: emailUser,
          pass: emailPass
        },
        connectionTimeout: 15000,
        socketTimeout: 15000
      };

    cachedTransporter = nodemailer.createTransport(transportOptions);
  }

  return cachedTransporter;
};

/**
 * Send OTP to the specified email using Nodemailer only
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code to send
 * @returns {Promise<boolean>} Success status
 */
const sendOtpEmail = async (email, otp) => {

  if (!email || !email.includes('@')) {
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
      const fromEmail = process.env.EMAIL_USER.trim();

      const mailOptions = {
        from: `"CivicWatch" <${fromEmail}>`,
        to: email,
        subject: 'CivicWatch Email Verification OTP',
        html: htmlContent
      };

      const sendPromise = transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Nodemailer dispatch timed out after 15000ms')), 15000)
      );

      await Promise.race([sendPromise, timeoutPromise]);
      console.log(`[NODEMAILER SUCCESS] OTP email successfully sent to ${email}`);
      return true;
    } catch (err) {
      console.error(`[NODEMAILER ERROR] ${err.message}`);
      if (cachedTransporter) {
        try { cachedTransporter.close(); } catch (_) { }
        cachedTransporter = null;
      }
    }
  }

  // Development Fallback: Log to console when credentials are missing or dispatch fails
  console.log(`[NODEMAILER FALLBACK] OTP Code for ${email} is: ${otp}`);
  return true;
};

module.exports = {
  generateOtp,
  sendOtpEmail
};
