@echo off
echo ========================================
echo DAIRY PRODUCTS WEBSITE - DATABASE SETUP
echo ========================================
echo.

echo This script will help you set up the MySQL database for your dairy products website.
echo.

REM Check if MySQL is installed and accessible
echo Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your system PATH
    pause
    exit /b 1
)

echo MySQL is installed and accessible.
echo.

REM Get database credentials
set /p DB_USER=Enter MySQL username (default: root): 
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASSWORD=Enter MySQL password: 
if "%DB_PASSWORD%"=="" (
    echo No password provided, using empty password...
    set DB_PASSWORD=
)

set /p DB_HOST=Enter MySQL host (default: localhost): 
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_PORT=Enter MySQL port (default: 3306): 
if "%DB_PORT%"=="" set DB_PORT=3306

echo.
echo Database configuration:
echo Host: %DB_HOST%
echo Port: %DB_PORT%
echo User: %DB_USER%
echo Password: [hidden]
echo.

REM Test MySQL connection
echo Testing MySQL connection...
if "%DB_PASSWORD%"=="" (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -e "SELECT 1;" >nul 2>&1
) else (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% -e "SELECT 1;" >nul 2>&1
)

if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MySQL with the provided credentials
    echo Please check your MySQL installation and credentials
    pause
    exit /b 1
)

echo MySQL connection successful!
echo.

REM Create database and import schema
echo Creating database and importing schema...
if "%DB_PASSWORD%"=="" (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% < database_schema.sql
) else (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% < database_schema.sql
)

if %errorlevel% neq 0 (
    echo ERROR: Failed to create database or import schema
    echo Please check the database_schema.sql file and try again
    pause
    exit /b 1
)

echo Database created and schema imported successfully!
echo.

REM Create .env file
echo Creating .env file...
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env"
    echo .env file created from template
) else (
    echo .env file already exists
)

echo.
echo ========================================
echo DATABASE SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Next steps:
echo 1. Update backend\.env with your database credentials
echo 2. Install backend dependencies: cd backend ^&^& npm install
echo 3. Start the backend server: npm start
echo 4. Install frontend dependencies: npm install
echo 5. Start the frontend: npm start
echo.
echo Database credentials to update in backend\.env:
echo DB_HOST=%DB_HOST%
echo DB_USER=%DB_USER%
echo DB_PASSWORD=%DB_PASSWORD%
echo DB_PORT=%DB_PORT%
echo DB_NAME=dairy_products_db
echo.
pause 