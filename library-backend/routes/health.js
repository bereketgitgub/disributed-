import express from 'express';
import { testConnection } from '../config/database.js';
import { testEmailConnection } from '../services/emailService.js';
import { testRedisConnection } from '../services/cacheService.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    checks: {
      database: false,
      redis: false,
      email: false
    }
  };

  try {
    // Check database connection
    health.checks.database = await testConnection();
    
    // Check Redis connection
    health.checks.redis = await testRedisConnection();
    
    // Check email connection
    health.checks.email = await testEmailConnection();

    const hasFailedChecks = Object.values(health.checks).includes(false);
    
    res.status(hasFailedChecks ? 500 : 200).json(health);
  } catch (error) {
    health.status = 'ERROR';
    health.error = error.message;
    res.status(500).json(health);
  }
});

router.get('/check', async (req, res) => {
  try {
    // Test database connection
    await db.query('SELECT 1');
    
    res.json({
      status: 'ok',
      timestamp: new Date(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router; 