import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

export default router; 