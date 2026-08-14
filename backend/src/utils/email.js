const nodemailer = require('nodemailer');

// Create transport dynamically based on Mailgun or standard SMTP environment variables
function createTransporter() {
  const host = process.env.MAILGUN_SMTP_SERVER || process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.MAILGUN_LOGIN || process.env.SMTP_USER;
  const pass = process.env.MAILGUN_PASSWORD || process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  return null;
}

async function sendVerificationEmail(email, token, otp) {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  const subject = 'S-Bridge — Verify Your Account';
  const textContent = `Welcome to S-Bridge!\n\nPlease verify your account by clicking the link below or entering your OTP code:\n\nVerification Link: ${verificationLink}\nVerification OTP: ${otp}\n\nThis verification code expires in 24 hours.`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563eb;">Welcome to S-Bridge!</h2>
      <p style="color: #475569; font-size: 14px;">Please confirm your email address to activate your attachment & internship portal account.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <p style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Your Verification Code (OTP)</p>
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1e293b;">${otp}</span>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${verificationLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">Verify Account Email</a>
      </div>

      <p style="font-size: 12px; color: #94a3b8;">If you did not request this account creation, you can safely ignore this email.</p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"S-Bridge" <noreply@sbridge.edu>',
        to: email,
        subject,
        text: textContent,
        html: htmlContent
      });
      console.log(`[Email Service] Verification email dispatched to ${email}`);
    } catch (err) {
      console.error('[Email Service] Error sending email via SMTP:', err.message);
    }
  } else {
    // Console fallback for dev mode when SMTP credentials are not set
    console.log('\n=================== [DEV MODE EMAIL DISPATCH] ===================');
    console.log(`TO: ${email}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`VERIFICATION LINK: ${verificationLink}`);
    console.log(`VERIFICATION OTP: ${otp}`);
    console.log('=================================================================\n');
  }
}

async function sendPasswordResetEmail(email, token, otp) {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const subject = 'S-Bridge — Password Reset Request';
  const textContent = `You requested a password reset for your S-Bridge account.\n\nUse the OTP below or click the link to reset your password:\n\nReset Link: ${resetLink}\nOTP Code: ${otp}\n\nThis code expires in 1 hour. If you did not request this, please ignore this email.`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p style="color: #475569; font-size: 14px;">We received a request to reset the password for your S-Bridge account associated with this email.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <p style="font-size: 12px; color: #64748b; margin-bottom: 5px;">Your Password Reset Code</p>
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1e293b;">${otp}</span>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">Reset Password</a>
      </div>

      <p style="font-size: 12px; color: #94a3b8;">This code expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"S-Bridge" <noreply@sbridge.edu>',
        to: email,
        subject,
        text: textContent,
        html: htmlContent
      });
      console.log(`[Email Service] Password reset email dispatched to ${email}`);
    } catch (err) {
      console.error('[Email Service] Error sending password reset email:', err.message);
    }
  } else {
    console.log('\n=================== [DEV MODE PASSWORD RESET EMAIL] ===================');
    console.log(`TO: ${email}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`RESET LINK: ${resetLink}`);
    console.log(`RESET OTP: ${otp}`);
    console.log('=======================================================================\n');
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
