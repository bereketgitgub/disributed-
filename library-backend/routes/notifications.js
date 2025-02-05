import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../config/database.js';

const router = express.Router();

// Get user's notifications
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const [notifications] = await db.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.user_id]
    );
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res, next) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = true WHERE notification_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
});

// Delete notification
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    await db.query(
      'DELETE FROM notifications WHERE notification_id = ? AND user_id = ?',
      [req.params.id, req.user.user_id]
    );
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
});

export default router; 