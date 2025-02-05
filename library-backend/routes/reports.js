import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { db } from '../config/database.js';

const router = express.Router();

// Get basic stats
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [[totalBooks]] = await db.query('SELECT COUNT(*) as count FROM books');
    const [[activeLoans]] = await db.query(
      "SELECT COUNT(*) as count FROM loans WHERE status = 'BORROWED'"
    );
    const [[overdueLoans]] = await db.query(
      "SELECT COUNT(*) as count FROM loans WHERE due_date < CURRENT_DATE AND status = 'BORROWED'"
    );
    const [[totalUsers]] = await db.query('SELECT COUNT(*) as count FROM users');

    res.json({
      totalBooks: totalBooks.count,
      activeLoans: activeLoans.count,
      overdueLoans: overdueLoans.count,
      totalUsers: totalUsers.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Get recent loans
router.get('/recent-loans', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [loans] = await db.query(`
      SELECT 
        l.loan_id,
        b.title as book_title,
        CONCAT(m.first_name, ' ', m.last_name) as member_name,
        l.loan_date,
        l.due_date,
        l.status
      FROM loans l
      JOIN books b ON l.book_id = b.book_id
      JOIN members m ON l.member_id = m.member_id
      ORDER BY l.loan_date DESC
      LIMIT 10
    `);
    
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent loans' });
  }
});

export default router;