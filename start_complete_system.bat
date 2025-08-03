@echo off
echo Starting Complete Dairy Website System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm install && npm start"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm start"

echo.
echo System starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Health Check: http://localhost:5000/api/health
echo.

pause 