@echo off
REM 🥛 Dairy Products Website - Quick Setup Script for Windows
REM This script automates the setup process for testing the complete dairy products website

echo 🥛 Starting Dairy Products Website Setup...
echo ==========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js v16 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [SUCCESS] Node.js found
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please install npm.
    pause
    exit /b 1
) else (
    echo [SUCCESS] npm found
)

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MySQL not found. Please install MySQL v8.0 or higher.
    echo Download from: https://dev.mysql.com/downloads/
) else (
    echo [SUCCESS] MySQL found
)

echo.
echo [INFO] Checking prerequisites completed.
echo.

REM Setup database
echo [INFO] Setting up database...

REM Check if MySQL service is running
net start mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MySQL service not running. Please start MySQL service.
    echo Run: net start mysql
    echo.
)

REM Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS dairy_products_db;" >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Database created successfully
) else (
    echo [ERROR] Failed to create database. Please check MySQL credentials.
    echo.
)

REM Import schema
if exist "database_schema.sql" (
    mysql -u root -p dairy_products_db < database_schema.sql
    if %errorlevel% equ 0 (
        echo [SUCCESS] Database schema imported successfully
    ) else (
        echo [ERROR] Failed to import database schema
    )
) else (
    echo [ERROR] database_schema.sql not found
)

echo.

REM Setup backend
echo [INFO] Setting up backend...

REM Create backend directory if it doesn't exist
if not exist "backend" mkdir backend
cd backend

REM Create package.json if it doesn't exist
if not exist "package.json" (
    echo [INFO] Creating package.json...
    (
        echo {
        echo   "name": "dairy-products-backend",
        echo   "version": "1.0.0",
        echo   "description": "Real-time dairy products e-commerce backend API",
        echo   "main": "server.js",
        echo   "scripts": {
        echo     "start": "node server.js",
        echo     "dev": "nodemon server.js",
        echo     "test": "jest"
        echo   },
        echo   "dependencies": {
        echo     "express": "^4.18.2",
        echo     "mysql2": "^3.6.5",
        echo     "bcryptjs": "^2.4.3",
        echo     "jsonwebtoken": "^9.0.2",
        echo     "cors": "^2.8.5",
        echo     "helmet": "^7.1.0",
        echo     "express-rate-limit": "^7.1.5",
        echo     "express-validator": "^7.0.1",
        echo     "multer": "^1.4.5-lts.1",
        echo     "nodemailer": "^6.9.7",
        echo     "twilio": "^4.19.0",
        echo     "socket.io": "^4.7.4",
        echo     "redis": "^4.6.10",
        echo     "dotenv": "^16.3.1",
        echo     "compression": "^1.7.4",
        echo     "morgan": "^1.10.0",
        echo     "winston": "^3.11.0",
        echo     "joi": "^17.11.0",
        echo     "moment": "^2.29.4",
        echo     "uuid": "^9.0.1",
        echo     "sharp": "^0.32.6",
        echo     "aws-sdk": "^2.1473.0",
        echo     "stripe": "^13.10.0",
        echo     "razorpay": "^2.8.6",
        echo     "node-cron": "^3.0.3",
        echo     "express-session": "^1.17.3",
        echo     "connect-redis": "^7.1.0"
        echo   },
        echo   "devDependencies": {
        echo     "nodemon": "^3.0.1",
        echo     "jest": "^29.7.0",
        echo     "supertest": "^6.3.3"
        echo   }
        echo }
    ) > package.json
)

REM Install dependencies
echo [INFO] Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file...
    (
        echo # Server Configuration
        echo NODE_ENV=development
        echo PORT=5000
        echo FRONTEND_URL=http://localhost:3000
        echo.
        echo # Database Configuration
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=dairy_products_db
        echo DB_PORT=3306
        echo.
        echo # Redis Configuration
        echo REDIS_URL=redis://localhost:6379
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
        echo JWT_EXPIRES_IN=24h
        echo JWT_REFRESH_EXPIRES_IN=7d
        echo.
        echo # Session Configuration
        echo SESSION_SECRET=your_session_secret_key_here_change_this_in_production
        echo.
        echo # Email Configuration ^(Optional for testing^)
        echo EMAIL_HOST=smtp.gmail.com
        echo EMAIL_PORT=587
        echo EMAIL_USER=your_email@gmail.com
        echo EMAIL_PASS=your_app_password
        echo EMAIL_FROM=your_email@gmail.com
        echo.
        echo # SMS Configuration ^(Optional for testing^)
        echo TWILIO_ACCOUNT_SID=your_twilio_account_sid
        echo TWILIO_AUTH_TOKEN=your_twilio_auth_token
        echo TWILIO_PHONE_NUMBER=your_twilio_phone_number
        echo.
        echo # Payment Gateway Configuration ^(Optional for testing^)
        echo STRIPE_SECRET_KEY=your_stripe_secret_key
        echo STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
        echo RAZORPAY_KEY_ID=your_razorpay_key_id
        echo RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ) > .env
    echo [WARNING] Please update the .env file with your specific configurations
)

cd ..

echo.

REM Setup frontend
echo [INFO] Setting up frontend...

REM Install dependencies
echo [INFO] Installing frontend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating frontend .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
        echo REACT_APP_SOCKET_URL=http://localhost:5000
    ) > .env
)

echo.

REM Start services
echo [INFO] Starting services...

REM Start backend
echo [INFO] Starting backend server...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
echo [INFO] Starting frontend server...
start "Frontend Server" cmd /k "npm start"

echo.
echo [SUCCESS] All services started!
echo [INFO] Backend: http://localhost:5000
echo [INFO] Frontend: http://localhost:3000
echo [INFO] Health Check: http://localhost:5000/health
echo.
echo [SUCCESS] Setup completed successfully!
echo.
echo [INFO] Next steps:
echo [INFO] 1. Open http://localhost:3000 in your browser
echo [INFO] 2. Register a new account
echo [INFO] 3. Browse products and place test orders
echo [INFO] 4. Check real-time features
echo.
echo [INFO] For detailed testing instructions, see TESTING_GUIDE.md
echo.
pause 