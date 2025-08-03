Write-Host "========================================" -ForegroundColor Green
Write-Host "STARTING DAIRY WEBSITE SERVER" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Server will run continuously..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location $PSScriptRoot
node server_simple.js 