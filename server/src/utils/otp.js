const https = require('https');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Generate a 6-digit numeric OTP code
 * @returns {string} 6-digit OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Exchange Google OAuth2 Refresh Token for an Access Token over HTTPS (Port 443)
 */
const getGoogleAccessToken = () => {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID.trim(),
      client_secret: process.env.GOOGLE_CLIENT_SECRET.trim(),
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN.trim(),
      grant_type: 'refresh_token'
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      port: 443,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.access_token) {
            resolve(parsed.access_token);
          } else {
            reject(new Error(parsed.error_description || parsed.error || 'Failed to obtain Google access token'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Google OAuth2 token request timed out')); });
    req.write(postData);
    req.end();
  });
};

/**
 * Send email via Gmail REST API over pure HTTPS (Port 443) using MIME multipart/alternative to prevent spam flags
 */
const sendViaGmailRestApi = async (toEmail, subject, otp, htmlContent) => {
  const accessToken = await getGoogleAccessToken();
  const fromEmail = process.env.EMAIL_USER.trim();
  const dateStr = new Date().toUTCString();
  const messageId = `<otp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}@civicwatch.org>`;
  const boundary = `====_MIME_boundary_${Date.now()}_====`;

  const plainTextContent = `Your CivicWatch verification passcode (OTP) is: ${otp}\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.`;

  const rawMessage = [
    `From: "CivicWatch" <${fromEmail}>`,
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    `Date: ${dateStr}`,
    `Message-ID: ${messageId}`,
    `Reply-To: ${fromEmail}`,
    `Auto-Submitted: auto-generated`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    plainTextContent,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlContent,
    ``,
    `--${boundary}--`
  ].join('\r\n');

  const base64EncodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const postData = JSON.stringify({ raw: base64EncodedMessage });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'gmail.googleapis.com',
      port: 443,
      path: '/gmail/v1/users/me/messages/send',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error ? parsed.error.message : `Gmail API returned HTTP ${res.statusCode}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Gmail REST API request timed out')); });
    req.write(postData);
    req.end();
  });
};

/**
 * Send OTP to the specified email using Gmail REST API over HTTPS
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code to send
 * @returns {Promise<boolean>} Success status
 */
const sendOtpEmail = async (email, otp) => {
  const timestamp = new Date().toISOString();

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    console.error(`[${timestamp}] [EMAIL FAILURE] Invalid or missing recipient email address: "${email}"`);
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

  const emailUser = process.env.EMAIL_USER;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  const hasOAuthCredentials = emailUser && clientId && clientSecret && refreshToken;

  if (hasOAuthCredentials) {
    try {
      const subject = `Your CivicWatch Verification Code: ${otp}`;
      const result = await sendViaGmailRestApi(email.trim().toLowerCase(), subject, otp, htmlContent);
      console.log(`[${timestamp}] [EMAIL SUCCESS] OTP email successfully sent via Gmail REST API (HTTPS Port 443) to ${email} (MessageID: ${result.id || 'N/A'})`);
      return true;
    } catch (err) {
      console.error(`[${timestamp}] [EMAIL FAILURE] Gmail REST API dispatch failed for ${email}. Reason: ${err.message}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[${timestamp}] [EMAIL DEV FALLBACK] OTP Code for ${email} is: ${otp}`);
        return true;
      }
      return false;
    }
  }

  // Development Fallback: Log to console when credentials are missing
  console.log(`[${timestamp}] [EMAIL NOTICE] Google OAuth2 credentials not set in .env. Console Fallback OTP for ${email} is: ${otp}`);
  return true;
};

module.exports = {
  generateOtp,
  sendOtpEmail
};
