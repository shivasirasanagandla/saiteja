# Dairy Products Website Startup Script
# This script will start both backend and frontend servers

Write-Host "Starting Dairy Products Website..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Check if ports are available
Write-Host "Checking port availability..." -ForegroundColor Cyan

if (Test-Port -Port 5000) {
    Write-Host "Port 5000 is already in use. Please stop the existing service." -ForegroundColor Red
    exit 1
}

if (Test-Port -Port 3000) {
    Write-Host "Port 3000 is already in use. Please stop the existing service." -ForegroundColor Red
    exit 1
}

Write-Host "Ports 3000 and 5000 are available" -ForegroundColor Green

# Install dependencies if needed
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan

# Install backend dependencies
if (Test-Path "backend/package.json") {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Install frontend dependencies
if (Test-Path "package.json") {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Dependencies installed" -ForegroundColor Green

# Start backend server
Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server_json.js" -WorkingDirectory "backend" -WindowStyle Hidden
Start-Sleep -Seconds 3

# Test backend server
Write-Host "Testing backend server..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 10
    Write-Host "Backend server is running!" -ForegroundColor Green
    Write-Host "   Health Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Products: $($response.data.products_count)" -ForegroundColor Gray
    Write-Host "   Categories: $($response.data.categories_count)" -ForegroundColor Gray
} catch {
    Write-Host "Backend server failed to start" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Start frontend server
Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "." -WindowStyle Hidden
Start-Sleep -Seconds 5

# Test frontend server
Write-Host "Testing frontend server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 10
    Write-Host "Frontend server is running!" -ForegroundColor Green
} catch {
    Write-Host "Frontend server might still be starting..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Website is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available API Endpoints:" -ForegroundColor Yellow
Write-Host "   Health Check: http://localhost:5000/api/health" -ForegroundColor Gray
Write-Host "   Products: http://localhost:5000/api/products" -ForegroundColor Gray
Write-Host "   Categories: http://localhost:5000/api/categories" -ForegroundColor Gray
Write-Host "   Users: http://localhost:5000/api/users" -ForegroundColor Gray
Write-Host "   Orders: http://localhost:5000/api/orders" -ForegroundColor Gray
Write-Host ""
Write-Host "Test Login Credentials:" -ForegroundColor Yellow
Write-Host "   Email: john.doe@example.com" -ForegroundColor Gray
Write-Host "   Password: password123" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop the servers, press Ctrl+C or close this window" -ForegroundColor Red
Write-Host ""

# Keep the script running
Write-Host "Press any key to stop the servers..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop servers
Write-Host ""
Write-Host "Stopping servers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Servers stopped" -ForegroundColor Green 