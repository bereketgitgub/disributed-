import { testConnections } from '../library-backend/utils/connectionTest.js';
import { db } from '../library-backend/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const checkEnvironmentVariables = () => {
  const required = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'JWT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);
  if (missing.length) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    return false;
  }
  return true;
};

const checkDatabaseTables = async () => {
  const requiredTables = [
    'users',
    'books',
    'categories',
    'loans',
    'members',
    'notifications',
    'audit_logs'
  ];

  for (const table of requiredTables) {
    try {
      await db.query(`SELECT 1 FROM ${table} LIMIT 1`);
      console.log(`✅ Table ${table} exists`);
    } catch (error) {
      console.error(`❌ Table ${table} missing or inaccessible`);
      return false;
    }
  }
  return true;
};

const main = async () => {
  console.log('Running pre-deployment checks...\n');

  const envCheck = checkEnvironmentVariables();
  if (!envCheck) process.exit(1);

  const connections = await testConnections();
  if (connections.errors.length > 0) process.exit(1);

  const dbTablesCheck = await checkDatabaseTables();
  if (!dbTablesCheck) process.exit(1);

  console.log('\n✅ All checks passed!');
  process.exit(0);
};

main().catch(console.error); 