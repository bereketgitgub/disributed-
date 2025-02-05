import express from 'express';
import { authenticateToken, isAdmin } from '../../middleware/auth.js';
import { db } from '../../config/database.js';

const router = express.Router();

// Get financial reports
router.get('/financial', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    // Late fees summary
    const [feesSummary] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total_fees,
        SUM(amount) as total_amount,
        SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END) as collected_amount,
        SUM(CASE WHEN status = 'UNPAID' THEN amount ELSE 0 END) as pending_amount
      FROM late_fees
      GROUP BY month
      ORDER BY month DESC
    `);

    // Members with outstanding fees
    const [outstandingFees] = await db.query(`
      SELECT 
        m.member_id,
        m.first_name,
        m.last_name,
        COUNT(lf.fee_id) as fee_count,
        SUM(lf.amount) as total_amount
      FROM members m
      JOIN loans l ON m.member_id = l.member_id
      JOIN late_fees lf ON l.loan_id = lf.loan_id
      WHERE lf.status = 'UNPAID'
      GROUP BY m.member_id
      ORDER BY total_amount DESC
    `);

    res.json({
      feesSummary,
      outstandingFees
    });
  } catch (error) {
    next(error);
  }
});

export default router;