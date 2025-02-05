import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user with role
    const [users] = await db.query(
      `SELECT u.*, r.role_name, r.permissions
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
      [decoded.userId]
    );
    
    if (!users.length) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = users[0];
    user.permissions = JSON.parse(user.permissions);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role_name !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const isLibrarian = (req, res, next) => {
  if (!['admin', 'librarian'].includes(req.user.role_name)) {
    return res.status(403).json({ message: 'Staff access required' });
  }
  next();
};

export const hasPermission = (permission) => {
  return (req, res, next) => {
    const userPerms = req.user.permissions;
    
    if (userPerms.all) return next(); // Admin has all permissions
    
    const [resource, action] = permission.split(':');
    if (!userPerms[resource] || !userPerms[resource][action]) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    next();
  };
}; 