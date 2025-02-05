import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

router.get('/overview', async (req, res, next) => {
  try {
    const [[totalBooks]] = await db.query('SELECT COUNT(*) as count FROM books');
    const [[activeLoans]] = await db.query(
      "SELECT COUNT(*) as count FROM loans WHERE status = 'BORROWED'"
    );
    const [[totalMembers]] = await db.query('SELECT COUNT(*) as count FROM members');

    res.json({
      totalBooks: totalBooks.count,
      activeLoans: activeLoans.count,
      totalMembers: totalMembers.count
    });
  } catch (error) {
    next(error);
  }
});

export default router; 