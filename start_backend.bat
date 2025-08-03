@echo off
echo Starting Dairy Website Backend Server...
echo.

cd backend

echo Installing dependencies...
npm install

echo.
echo Starting server on http://localhost:5000
echo Health check: http://localhost:5000/api/health
echo.

npm start

pause 