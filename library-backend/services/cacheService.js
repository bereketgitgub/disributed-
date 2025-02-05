import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redis = null;

// Create Redis client if configuration exists
const createRedisClient = () => {
  if (process.env.REDIS_HOST) {
    return new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });
  }
  return null;
};

// Test Redis connection
export const testRedisConnection = async () => {
  try {
    if (!redis && process.env.REDIS_HOST) {
      redis = createRedisClient();
    }
    
    if (!redis) {
      console.log('ℹ️ Redis not configured - skipping connection check');
      return true; // Return true if Redis is not configured
    }

    await redis.ping();
    console.log('✅ Redis connection successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    return false;
  }
};

// Cache methods
export const setCache = async (key, value, ttl = 3600) => {
  try {
    if (!redis) return;
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const getCache = async (key) => {
  try {
    if (!redis) return null;
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    if (!redis) return;
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}; 