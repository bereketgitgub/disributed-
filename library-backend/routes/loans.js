import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../config/database.js';

const router = express.Router();

// Borrow a book
router.post('/borrow', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { bookId } = req.body;
    const userId = req.user.user_id;

    await connection.beginTransaction();

    // Get member_id
    const [members] = await connection.query(
      'SELECT member_id FROM members WHERE user_id = ?',
      [userId]
    );

    let memberId;
    if (!members.length) {
      // Create member record if it doesn't exist
      const [user] = await connection.query(
        'SELECT * FROM users WHERE user_id = ?',
        [userId]
      );

      if (!user.length) {
        await connection.rollback();
        return res.status(400).json({ message: 'User not found' });
      }

      const [result] = await connection.query(
        `INSERT INTO members (user_id, first_name, last_name, email) 
         VALUES (?, ?, ?, ?)`,
        [userId, user[0].username, '', user[0].email]
      );

      memberId = result.insertId;
    } else {
      memberId = members[0].member_id;
    }

    // Check book availability
    const [books] = await connection.query(
      'SELECT * FROM books WHERE book_id = ? AND available_copies > 0',
      [bookId]
    );

    if (!books.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Book not available' });
    }

    // Check if user has any overdue books
    const [overdueLoans] = await connection.query(
      `SELECT COUNT(*) as count FROM loans 
       WHERE member_id = ? AND due_date < NOW() AND status = 'BORROWED'`,
      [memberId]
    );

    if (overdueLoans[0].count > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        message: 'Cannot borrow - you have overdue books' 
      });
    }

    // Create loan record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period

    await connection.query(
      `INSERT INTO loans (book_id, member_id, loan_date, due_date, status) 
       VALUES (?, ?, NOW(), ?, 'BORROWED')`,
      [bookId, memberId, dueDate]
    );

    // Update book availability
    await connection.query(
      `UPDATE books 
       SET available_copies = available_copies - 1,
           status = CASE 
             WHEN available_copies - 1 = 0 THEN 'OUT_OF_STOCK'
             WHEN available_copies - 1 <= 2 THEN 'LOW_STOCK'
             ELSE 'AVAILABLE'
           END
       WHERE book_id = ?`,
      [bookId]
    );

    await connection.commit();
    res.json({ 
      message: 'Book borrowed successfully', 
      dueDate 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Borrow error:', error);
    res.status(500).json({ message: 'Failed to borrow book' });
  } finally {
    connection.release();
  }
});

// Get user's loans
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [loans] = await db.query(
      `SELECT l.*, b.title as book_title, b.author, b.isbn,
              DATEDIFF(l.due_date, CURRENT_DATE()) as days_remaining
       FROM loans l 
       JOIN books b ON l.book_id = b.book_id 
       JOIN members m ON l.member_id = m.member_id 
       WHERE m.user_id = ?
       ORDER BY l.loan_date DESC`,
      [req.user.user_id]
    );

    res.json(loans);
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ message: 'Failed to fetch loans' });
  }
});

// Return a book
router.post('/return', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { loanId } = req.body;

    await connection.beginTransaction();

    // Get loan details
    const [loans] = await connection.query(
      `SELECT l.*, b.book_id 
       FROM loans l
       JOIN books b ON l.book_id = b.book_id
       WHERE l.loan_id = ?`,
      [loanId]
    );

    if (!loans.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Loan not found' });
    }

    const loan = loans[0];

    // Update loan status
    await connection.query(
      `UPDATE loans 
       SET return_date = NOW(), 
           status = 'RETURNED' 
       WHERE loan_id = ?`,
      [loanId]
    );

    // Update book availability
    await connection.query(
      `UPDATE books 
       SET available_copies = available_copies + 1,
           status = CASE 
             WHEN available_copies + 1 > 2 THEN 'AVAILABLE'
             ELSE 'LOW_STOCK'
           END
       WHERE book_id = ?`,
      [loan.book_id]
    );

    await connection.commit();
    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Return error:', error);
    res.status(500).json({ message: 'Failed to return book' });
  } finally {
    connection.release();
  }
});

export default router; 