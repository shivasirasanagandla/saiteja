const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dairy_products_db',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  timezone: '+05:30', // IST timezone
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 20,
  queueLimit: 0,
  waitForConnections: true,
  multipleStatements: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};

// Initialize database connection
const initializeDatabase = async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    logger.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }
};

// Database query helper
const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Health check
const healthCheck = async () => {
  try {
    await query('SELECT 1 as health');
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
  }
};

// Close pool
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool closed successfully');
  } catch (error) {
    logger.error('Error closing database pool:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Closing database connections...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Closing database connections...');
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  initializeDatabase,
  healthCheck,
  closePool,
  getConnection: () => pool.getConnection()
}; 