import cron from 'node-cron';
import { db } from '../config/database.js';
import { sendDueDateReminder } from './notificationService.js';
import { logActivity } from '../middleware/logger.js';

// Check for due dates daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    // Get loans due in 2 days
    const [loans] = await db.query(`
      SELECT * FROM loans 
      WHERE status = 'BORROWED' 
      AND due_date = DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)
    `);

    for (const loan of loans) {
      await sendDueDateReminder(loan);
    }

    // Calculate late fees
    const [overdueLoans] = await db.query(`
      SELECT * FROM loans 
      WHERE status = 'BORROWED' 
      AND due_date < CURRENT_DATE
      AND loan_id NOT IN (SELECT loan_id FROM late_fees)
    `);

    for (const loan of overdueLoans) {
      const daysLate = Math.floor(
        (new Date() - new Date(loan.due_date)) / (1000 * 60 * 60 * 24)
      );
      const feeAmount = daysLate * 0.50; // $0.50 per day

      await db.query(
        `INSERT INTO late_fees (loan_id, amount) VALUES (?, ?)`,
        [loan.loan_id, feeAmount]
      );

      await logActivity(
        null,
        'CREATE',
        'LATE_FEE',
        loan.loan_id,
        { amount: feeAmount, daysLate }
      );
    }
  } catch (error) {
    console.error('Cron job failed:', error);
  }
}); 