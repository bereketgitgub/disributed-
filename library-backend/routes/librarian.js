import express from 'express';
import { authenticateToken, isLibrarian } from '../middleware/auth.js';
import { db } from '../config/database.js';

const router = express.Router();

// Get all books
router.get('/books', authenticateToken, isLibrarian, async (req, res, next) => {
  try {
    const [books] = await db.query(
      `SELECT b.*, c.name as category_name 
       FROM books b 
       LEFT JOIN categories c ON b.category_id = c.category_id`
    );
    res.json(books);
  } catch (error) {
    next(error);
  }
});

// Add book
router.post('/books', authenticateToken, isLibrarian, async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { title, author, isbn, publisher, publicationYear, copies, categoryId } = req.body;
    
    const [result] = await connection.query(
      `INSERT INTO books (title, author, isbn, publisher, publication_year, 
        total_copies, available_copies, category_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, publisher, publicationYear, copies, copies, categoryId]
    );

    await connection.commit();
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

// Process loan
router.post('/loans', authenticateToken, isLibrarian, async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { memberId, bookId, dueDate } = req.body;
    
    // Check book availability
    const [[book]] = await connection.query(
      'SELECT available_copies FROM books WHERE book_id = ?',
      [bookId]
    );

    if (!book || book.available_copies < 1) {
      return res.status(400).json({ message: 'Book not available' });
    }

    // Create loan
    await connection.query(
      `INSERT INTO loans (member_id, book_id, loan_date, due_date, status) 
       VALUES (?, ?, NOW(), ?, 'BORROWED')`,
      [memberId, bookId, dueDate]
    );

    // Update book availability
    await connection.query(
      `UPDATE books 
       SET available_copies = available_copies - 1 
       WHERE book_id = ?`,
      [bookId]
    );

    await connection.commit();
    res.json({ message: 'Loan processed successfully' });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

export default router; 