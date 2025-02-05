import { db } from '../config/database.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const createNotification = async (userId, title, message, type) => {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type) 
       VALUES (?, ?, ?, ?)`,
      [userId, title, message, type]
    );
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

export const sendDueDateReminder = async (loan) => {
  const [users] = await db.query(
    'SELECT email FROM users WHERE user_id = ?',
    [loan.member_id]
  );

  if (users.length) {
    const user = users[0];
    await createNotification(
      loan.member_id,
      'Book Due Soon',
      `Your book is due in 2 days`,
      'DUE_DATE_REMINDER'
    );

    await sendEmail(
      user.email,
      'Library Book Due Soon',
      `Your book is due in 2 days. Please return it to avoid late fees.`
    );
  }
}; 