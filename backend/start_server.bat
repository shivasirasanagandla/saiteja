@echo off
echo ========================================
echo STARTING DAIRY WEBSITE SERVER
echo ========================================
echo.
echo Server will run continuously...
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
node server_simple.js
pause 