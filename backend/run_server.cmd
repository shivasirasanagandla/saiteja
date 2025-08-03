@echo off
title Dairy Website Server
color 0A
echo ========================================
echo    DAIRY WEBSITE SERVER
echo ========================================
echo.
echo Starting server on port 5000...
echo Server will run continuously
echo Press Ctrl+C to stop
echo.
echo ========================================
echo.

cd /d "%~dp0"
node server_simple.js

echo.
echo Server stopped. Press any key to exit...
pause > nul 