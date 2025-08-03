# Database Setup Guide

This guide will help you set up the MySQL database for your dairy products website.

## Prerequisites

- MySQL Server installed and running
- MySQL command line client accessible from PATH
- Node.js and npm installed

## Quick Setup (Automated)

### Option 1: Using PowerShell (Recommended)
```powershell
# Run the PowerShell setup script
.\setup_database.ps1
```

### Option 2: Using Batch File
```cmd
# Run the batch setup script
setup_database.bat
```

## Manual Setup

If you prefer to set up the database manually, follow these steps:

### 1. Connect to MySQL
```bash
mysql -u root -p
```

### 2. Create Database
```sql
CREATE DATABASE IF NOT EXISTS dairy_products_db;
USE dairy_products_db;
```

### 3. Import Schema
```bash
mysql -u root -p dairy_products_db < database_schema.sql
```

### 4. Verify Setup
```sql
-- Connect to the database
USE dairy_products_db;

-- Check if tables were created
SHOW TABLES;

-- Check sample data
SELECT * FROM products LIMIT 5;
SELECT * FROM product_categories;
```

## Environment Configuration

### 1. Create Environment File
Copy the example environment file:
```bash
cp backend/env.example backend/.env
```

### 2. Update Database Configuration
Edit `backend/.env` and update these values:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dairy_products_db
DB_PORT=3306
```

## Database Schema Overview

The database includes the following main components:

### Core Tables
- **users** - User accounts and authentication
- **user_addresses** - Delivery addresses
- **products** - Product catalog
- **product_categories** - Product categories
- **product_inventory** - Stock management
- **orders** - Order management
- **order_items** - Order line items
- **payments** - Payment processing
- **order_tracking** - Delivery tracking

### Features
- **Stored Procedures** - For common operations like creating orders
- **Triggers** - Automatic inventory updates
- **Views** - Predefined queries for common operations
- **Indexes** - Optimized for performance

## Sample Data

The database comes pre-loaded with:
- 7 product categories (Fresh Milk, Curd & Yogurt, etc.)
- 8 sample products with realistic data
- 5 delivery zones
- Inventory records for all products

## Testing the Setup

### 1. Test Database Connection
```bash
cd backend
npm install
npm start
```

### 2. Check API Endpoints
- Visit `http://localhost:5000/api/health` to check server status
- Visit `http://localhost:5000/api/products` to see products

### 3. Test Frontend
```bash
npm install
npm start
```

Visit `http://localhost:3000` to see the website.

## Troubleshooting

### Common Issues

1. **MySQL Connection Failed**
   - Verify MySQL is running
   - Check credentials in `.env` file
   - Ensure MySQL is in system PATH

2. **Permission Denied**
   - Make sure your MySQL user has CREATE DATABASE privileges
   - Try using root user or create a dedicated user

3. **Port Already in Use**
   - Change the port in `.env` file
   - Kill existing processes using the port

4. **Schema Import Failed**
   - Check if `database_schema.sql` exists
   - Verify MySQL syntax compatibility
   - Check for syntax errors in the schema file

### Useful Commands

```sql
-- Check database status
SHOW DATABASES;
USE dairy_products_db;
SHOW TABLES;

-- Check user privileges
SHOW GRANTS FOR 'your_username'@'localhost';

-- Reset database (if needed)
DROP DATABASE IF EXISTS dairy_products_db;
CREATE DATABASE dairy_products_db;
USE dairy_products_db;
SOURCE database_schema.sql;
```

## Next Steps

After successful database setup:

1. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   npm start
   ```

3. **Configure Additional Services**
   - Set up email configuration for notifications
   - Configure SMS service for OTP
   - Set up payment gateway credentials

## Database Maintenance

### Regular Tasks
- Monitor inventory levels
- Check for expired products
- Review order analytics
- Backup database regularly

### Backup Database
```bash
mysqldump -u root -p dairy_products_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u root -p dairy_products_db < backup_file.sql
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Check the console logs for error messages
4. Ensure all environment variables are correctly set 