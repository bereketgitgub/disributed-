import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';

const ADMIN_PASSWORD = 'admin123';
const LIBRARIAN_PASSWORD = 'librarian123';

const initializeDatabase = async () => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Clear existing data
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE members');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('TRUNCATE TABLE roles');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Create admin role first
    const [adminRoleResult] = await connection.query(
      `INSERT INTO roles (role_name, description, permissions) VALUES (?, ?, ?)`,
      [
        'admin',
        'Administrator with full access',
        JSON.stringify({
          all: true,
          books: { read: true, write: true, delete: true },
          loans: { read: true, write: true, manage: true },
          members: { read: true, write: true, delete: true },
          reports: { read: true, generate: true },
          settings: { manage: true }
        })
      ]
    );

    // Create admin user with fixed password hash
    const adminPassword = await bcrypt.hash('admin123', 10);
    const [adminResult] = await connection.query(
      `INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)`,
      ['admin', 'admin@library.local', adminPassword, adminRoleResult.insertId]
    );

    // Create admin member record
    await connection.query(
      `INSERT INTO members (user_id, first_name, last_name, email) VALUES (?, ?, ?, ?)`,
      [adminResult.insertId, 'System', 'Administrator', 'admin@library.local']
    );

    // Create librarian role
    const [librarianRoleResult] = await connection.query(
      `INSERT INTO roles (role_name, description, permissions) VALUES (?, ?, ?)`,
      [
        'librarian',
        'Library staff member',
        JSON.stringify({
          books: { read: true, write: true },
          loans: { read: true, write: true },
          members: { read: true, write: true },
          reports: { read: true }
        })
      ]
    );

    // Create librarian user
    const librarianPassword = await bcrypt.hash('librarian123', 10);
    const [librarianResult] = await connection.query(
      `INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)`,
      ['librarian', 'librarian@library.local', librarianPassword, librarianRoleResult.insertId]
    );

    // Create librarian member record
    await connection.query(
      `INSERT INTO members (user_id, first_name, last_name, email) VALUES (?, ?, ?, ?)`,
      [librarianResult.insertId, 'Library', 'Staff', 'librarian@library.local']
    );

    // Add member role after librarian role
    const [memberRoleResult] = await connection.query(
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

    await connection.commit();
    
    // Verify setup
    const [users] = await connection.query(
      `SELECT u.username, u.email, u.password_hash, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id`
    );
    
    console.log('✅ Database initialized successfully');
    console.log('Created users:', users.map(u => ({
      username: u.username,
      role: u.role_name,
      passwordHash: u.password_hash.substring(0, 10) + '...'
    })));

  } catch (error) {
    await connection.rollback();
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Run initialization
initializeDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1)); 