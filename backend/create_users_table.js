const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'YourStrongPassword@123',
  database: 'dairy_products_db',
  port: 3306
};

async function createUsersTable() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Create users table with all required fields
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        mobile VARCHAR(15) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE,
        gender ENUM('male', 'female', 'other'),
        profile_image VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_mobile (mobile)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createTableSQL);
    console.log('✅ Users table created successfully');
    
    // Check if table was created
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    if (tables.length > 0) {
      console.log('✅ Users table exists');
      
      // Show table structure
      const [columns] = await connection.execute('DESCRIBE users');
      console.log('\n📋 Users table structure:');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });
    } else {
      console.log('❌ Users table was not created');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createUsersTable(); 