import express from 'express';
import { authenticateToken, isLibrarian, isAdmin } from '../middleware/auth.js';
import { db } from '../config/database.js';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all books with filters
router.get('/', async (req, res, next) => {
  try {
    const {
      search = '',
      category = 'all',
      availability = 'all',
      sortBy = 'title',
      order = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    let query = `
      SELECT b.*, c.name as category_name 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.category_id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category !== 'all') {
      query += ` AND b.category_id = ?`;
      params.push(category);
    }

    if (availability !== 'all') {
      query += ` AND b.status = ?`;
      params.push(availability.toUpperCase());
    }

    // Get total count
    const [countResult] = await db.query(query, params);
    const total = countResult.length;

    // Add sorting and pagination
    query += ` ORDER BY b.${sortBy} ${order.toUpperCase()}`;
    query += ` LIMIT ? OFFSET ?`;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const [books] = await db.query(query, params);

    res.json({
      books,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
});

// Get categories
router.get('/categories', async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Add new book
router.post('/', authenticateToken, isLibrarian, async (req, res, next) => {
  try {
    const { title, author, isbn, publisher, publicationYear, copies, categoryId } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO books (title, author, isbn, publisher, publication_year, 
        available_copies, total_copies, category_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, publisher, publicationYear, copies, copies, categoryId]
    );

    res.status(201).json({ 
      message: 'Book added successfully', 
      bookId: result.insertId 
    });
  } catch (error) {
    next(error);
  }
});

// Bulk import books from CSV
router.post('/bulk-import', authenticateToken, upload.single('file'), async (req, res, next) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const book of results) {
          await db.query(
            `INSERT INTO books (title, author, isbn, publisher, publication_year, 
              available_copies, total_copies, category_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [book.title, book.author, book.isbn, book.publisher, 
             book.publicationYear, book.copies, book.copies, book.categoryId]
          );
        }
        fs.unlinkSync(req.file.path);
        res.json({ message: `${results.length} books imported successfully` });
      });
  } catch (error) {
    next(error);
  }
});

// Update book
router.put('/:id', authenticateToken, isLibrarian, async (req, res, next) => {
  try {
    const { title, author, isbn, publisher, publicationYear, copies, categoryId } = req.body;
    
    await db.query(
      `UPDATE books SET title = ?, author = ?, isbn = ?, publisher = ?, 
       publication_year = ?, total_copies = ?, category_id = ? WHERE book_id = ?`,
      [title, author, isbn, publisher, publicationYear, copies, categoryId, req.params.id]
    );

    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete book
router.delete('/:id', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM books WHERE book_id = ?', [req.params.id]);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router; 