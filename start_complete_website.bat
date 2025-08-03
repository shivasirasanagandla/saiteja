@echo off
echo ========================================
echo Starting Complete Dairy Products Website
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server_minimal.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo Website is starting up!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Please wait for both servers to fully start...
echo.
pause 