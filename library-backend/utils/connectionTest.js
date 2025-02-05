import { db } from '../config/database.js';
import nodemailer from 'nodemailer';

export const testConnections = async () => {
  const results = {
    database: false,
    smtp: false,
    errors: []
  };

  // Test database connection
  try {
    const [rows] = await db.query('SELECT 1');
    results.database = true;
    console.log('✅ Database connection successful');
  } catch (error) {
    results.errors.push({
      component: 'Database',
      error: error.message
    });
    console.error('❌ Database connection failed:', error.message);
  }

  // Test SMTP connection (only if SMTP settings are configured)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.verify();
      results.smtp = true;
      console.log('✅ SMTP connection successful');
    } catch (error) {
      results.errors.push({
        component: 'SMTP',
        error: error.message
      });
      console.error('❌ SMTP connection failed:', error.message);
    }
  } else {
    console.log('ℹ️ SMTP not configured - skipping email check');
    results.smtp = 'not_configured';
  }

  return results;
}; 