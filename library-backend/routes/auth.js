import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { validateRegistration, validateLogin } from '../middleware/validators.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Simplified registration
router.post('/register', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { username, email, password } = req.body;
    await connection.beginTransaction();

    // First check if member role exists, if not create it
    const [roles] = await connection.query(
      'SELECT role_id FROM roles WHERE role_name = ?',
      ['member']
    );

    let memberRoleId;
    if (!roles.length) {
      // Create member role if it doesn't exist
      const [newRole] = await connection.query(
        `INSERT INTO roles (role_name, description, permissions) VALUES (?, ?, ?)`,
        [
          'member',
          'Regular library member',
          JSON.stringify({
            books: { read: true },
            loans: { self: true }
          })
        ]
      );
      memberRoleId = newRole.insertId;
    } else {
      memberRoleId = roles[0].role_id;
    }

    // Check if user exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [userResult] = await connection.query(
      'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, memberRoleId]
    );

    // Create member record
    await connection.query(
      'INSERT INTO members (user_id, first_name, last_name, email) VALUES (?, ?, ?, ?)',
      [userResult.insertId, username, '', email]
    );

    await connection.commit();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  } finally {
    connection.release();
  }
});

// Login route with debug logging
router.post('/login', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);

    // Get user with role info
    const [users] = await connection.query(
      `SELECT u.*, r.role_name, r.permissions 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.username = ?`,
      [username]
    );

    if (!users.length) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];
    console.log('Found user:', {
      id: user.user_id,
      username: user.username,
      role: user.role_name,
      passwordHashPrefix: user.password_hash.substring(0, 10) + '...'
    });

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log('Password validation result:', validPassword);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.user_id,
        role: user.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    await connection.query(
      'UPDATE users SET last_login = NOW() WHERE user_id = ?',
      [user.user_id]
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role: user.role_name,
        permissions: JSON.parse(user.permissions)
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  } finally {
    connection.release();
  }
});

router.post('/admin/register', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user (role_id = 1 for admin)
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, 1)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Admin user registered successfully' });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  const { password_hash, ...user } = req.user;
  res.json(user);
});

export default router; 