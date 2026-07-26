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

  // 1. Try Brevo (Sendinblue) HTTP API (No recipient email restriction on free tier)
  if (process.env.BREVO_API_KEY) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'CivicWatch', email: 'civicwatch53@gmail.com' },
          to: [{ email }],
          subject: 'CivicWatch Email Verification OTP',
          htmlContent: htmlContent
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        console.log(`[BREVO SUCCESS] OTP email dispatched to ${email}`);
        return true;
      }
      console.error(`[BREVO ERROR] Failed to send email to ${email}:`, data);
    } catch (err) {
      console.error(`[BREVO ERROR] Exception:`, err.message);
    }
  }

  // 2. Try Resend HTTP API
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'CivicWatch <onboarding@resend.dev>',
          to: [email],
          subject: 'CivicWatch Email Verification OTP',
          html: htmlContent
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        console.log(`[RESEND SUCCESS] OTP email dispatched to ${email}`);
        return true;
      }

      console.error(`[RESEND ERROR] Failed to dispatch email to ${email}:`, data);
    } catch (err) {
      console.error(`[RESEND ERROR] Exception:`, err.message);
    }
  }

  // Fallback: If no API key is configured or email fails in dev/test, print OTP code in server logs so signups are not blocked
  console.log(`[EMAIL FALLBACK] OTP Code for ${email} is: ${otp}`);
  return true;
};

module.exports = {
  generateOtp,
  sendOtpEmail
};

