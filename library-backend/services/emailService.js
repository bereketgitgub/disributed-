import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

// Create email transporter if configuration exists
const createTransporter = () => {
  // Only create transporter if all required email settings are present
  if (process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    // Skip email check if not configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('ℹ️ Email service not configured - skipping connection check');
      return true;
    }

    if (!transporter) {
      transporter = createTransporter();
    }

    if (!transporter) {
      console.log('ℹ️ Email transporter not initialized');
      return true;
    }

    await transporter.verify();
    console.log('✅ Email connection successful');
    return true;
  } catch (error) {
    console.error('❌ Email connection failed:', error.message);
    // Don't fail server startup for email issues
    return true;
  }
};

// Send email
export const sendEmail = async (to, subject, text, html) => {
  try {
    if (!transporter) {
      console.log('ℹ️ Email service not configured - skipping email send');
      return null;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Send email error:', error);
    return null;
  }
}; 