# Database Setup Script for Dairy Products Website
# This script will create the database and populate it with sample data

Write-Host "🚀 Setting up Database for Dairy Products Website..." -ForegroundColor Green

# Check if MySQL is available
try {
    $mysqlVersion = mysql --version 2>$null
    if ($mysqlVersion) {
        Write-Host "✅ MySQL is available" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL not found. Please install MySQL first." -ForegroundColor Red
        Write-Host "Download from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ MySQL not found. Please install MySQL first." -ForegroundColor Red
    Write-Host "Download from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
    exit 1
}

# Database configuration
$DB_NAME = "dairy_products_db"
$DB_USER = "root"
$DB_PASSWORD = "YourStrongPassword@123"

Write-Host "📊 Creating database: $DB_NAME" -ForegroundColor Cyan

# Create database
try {
    mysql -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    Write-Host "✅ Database created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create database. Please check MySQL credentials." -ForegroundColor Red
    exit 1
}

# Import schema
Write-Host "📋 Importing database schema..." -ForegroundColor Cyan
try {
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < database_schema_simple.sql
    Write-Host "✅ Database schema imported successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to import schema. Please check the SQL file." -ForegroundColor Red
    exit 1
}

# Verify tables
Write-Host "🔍 Verifying database tables..." -ForegroundColor Cyan
try {
    $tables = mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SHOW TABLES;" 2>$null
    Write-Host "✅ Database tables created:" -ForegroundColor Green
    $tables | ForEach-Object { Write-Host "   - $_" -ForegroundColor White }
} catch {
    Write-Host "❌ Failed to verify tables." -ForegroundColor Red
}

# Check sample data
Write-Host "📊 Checking sample data..." -ForegroundColor Cyan
try {
    $productCount = mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) as count FROM products;" 2>$null
    $categoryCount = mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) as count FROM product_categories;" 2>$null
    Write-Host "✅ Sample data loaded:" -ForegroundColor Green
    Write-Host "   - Products: $productCount" -ForegroundColor White
    Write-Host "   - Categories: $categoryCount" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to check sample data." -ForegroundColor Red
}

Write-Host "🎉 Database setup completed successfully!" -ForegroundColor Green
Write-Host "You can now start the website server." -ForegroundColor Yellow 