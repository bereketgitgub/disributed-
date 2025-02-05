import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';
import './services/cronService.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import adminRoutes from './routes/admin.js';
import reportsRoutes from './routes/reports.js';
import loansRoutes from './routes/loans.js';
import categoryRoutes from './routes/categories.js';
import statsRoutes from './routes/stats.js';
import notificationsRoutes from './routes/notifications.js';
import librarianRoutes from './routes/librarian.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { db, testConnection } from './config/database.js';
import { testRedisConnection } from './services/cacheService.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// WebSocket server setup
const wss = new WebSocketServer({ 
  server,
  path: '/ws'
});

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/librarian', librarianRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// Test connections before starting server
const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    await testRedisConnection();

    // Start server with WebSocket support
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
}); 