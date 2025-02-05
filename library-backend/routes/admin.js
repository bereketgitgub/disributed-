import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { db } from '../config/database.js';

const router = express.Router();

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const [users] = await db.query(
      `SELECT u.*, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id`
    );
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Update user role
router.put('/users/:id/role', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { roleId } = req.body;
    await db.query(
      'UPDATE users SET role_id = ? WHERE user_id = ?',
      [roleId, req.params.id]
    );
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Get dashboard stats
router.get('/dashboard-stats', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    // Get basic stats
    const [[totalBooks]] = await db.query('SELECT COUNT(*) as count FROM books');
    const [[activeLoans]] = await db.query(
      "SELECT COUNT(*) as count FROM loans WHERE status = 'BORROWED'"
    );
    const [[overdueLoans]] = await db.query(
      'SELECT COUNT(*) as count FROM loans WHERE due_date < NOW()'
    );

    // Get loan trends for last 6 months
    const [loanTrends] = await db.query(`
      SELECT 
        DATE_FORMAT(loan_date, '%Y-%m') as month,
        COUNT(*) as loan_count
      FROM loans
      WHERE loan_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json({
      totalBooks: totalBooks.count,
      activeLoans: activeLoans.count,
      overdueLoans: overdueLoans.count,
      loanTrends
    });
  } catch (error) {
    next(error);
  }
});

// Get all books with category info
router.get('/books', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const [books] = await db.query(`
      SELECT b.*, c.name as category_name 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.category_id
      ORDER BY b.title
    `);
    res.json(books);
  } catch (error) {
    next(error);
  }
});

// Add book
router.post('/books', authenticateToken, isAdmin, async (req, res) => {
  const connection = await db.getConnection();
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      publication_year,
      category_id,
      total_copies,
      description
    } = req.body;

    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO books (
        title, author, isbn, publisher, publication_year,
        category_id, total_copies, available_copies, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, publisher, publication_year, 
       category_id, total_copies, total_copies, description]
    );

    await connection.commit();
    res.status(201).json({ 
      message: 'Book added successfully',
      bookId: result.insertId 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Failed to add book' });
  } finally {
    connection.release();
  }
});

export default router; 