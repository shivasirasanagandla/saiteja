@echo off
echo 🚀 Starting Dairy Products Website...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Start backend server
echo 🔧 Starting Backend Server...
start /B cmd /c "cd backend && node server_json.js"
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🎨 Starting Frontend Server...
start /B cmd /c "npm start"
timeout /t 5 /nobreak >nul

echo.
echo 🎉 Website is starting up!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo.
echo 📊 Available API Endpoints:
echo    Health Check: http://localhost:5000/api/health
echo    Products: http://localhost:5000/api/products
echo    Categories: http://localhost:5000/api/categories
echo    Users: http://localhost:5000/api/users
echo    Orders: http://localhost:5000/api/orders
echo.
echo 🔑 Test Login Credentials:
echo    Email: john.doe@example.com
echo    Password: password123
echo.
echo 🛑 To stop the servers, close this window
echo.
pause 