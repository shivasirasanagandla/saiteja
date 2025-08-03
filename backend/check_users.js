const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'YourStrongPassword@123',
  database: 'dairy_products_db',
  port: 3306
};

async function checkUsers() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Check table structure
    console.log('\n📋 Checking users table structure...');
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('Columns in users table:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });
    
    // Check existing users
    const [users] = await connection.execute('SELECT user_id, email, mobile FROM users');
    console.log('\n📋 Existing Users:');
    console.log('ID | Email | Mobile');
    console.log('---|-------|--------');
    
    users.forEach(user => {
      console.log(`${user.user_id} | ${user.email} | ${user.mobile}`);
    });
    
    console.log(`\nTotal users: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n🗑️  Clearing all users...');
      await connection.execute('DELETE FROM users');
      console.log('✅ All users cleared');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkUsers(); 