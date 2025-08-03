# Data Viewer for Dairy Products Website
# This script will display all stored data in a formatted way

Write-Host "=== DAIRY PRODUCTS WEBSITE - STORED DATA VIEWER ===" -ForegroundColor Green
Write-Host ""

# Function to read JSON file
function Read-JsonFile {
    param([string]$FilePath)
    try {
        $content = Get-Content $FilePath -Raw
        return $content | ConvertFrom-Json
    } catch {
        Write-Host "Error reading $FilePath : $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Check if servers are running
Write-Host "Checking server status..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend server is running" -ForegroundColor Green
    Write-Host "   Products: $($health.data.products_count)" -ForegroundColor Gray
    Write-Host "   Categories: $($health.data.categories_count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend server is not running" -ForegroundColor Red
    Write-Host "Please start the servers first using: .\start_website.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Display Products Data
Write-Host "=== PRODUCTS DATA ===" -ForegroundColor Yellow
$products = Read-JsonFile "backend/data/products.json"
foreach ($product in $products) {
    Write-Host "Product ID: $($product.product_id)" -ForegroundColor Cyan
    Write-Host "  Name: $($product.product_name)" -ForegroundColor White
    Write-Host "  Price: ₹$($product.sale_price) (Original: ₹$($product.base_price))" -ForegroundColor White
    Write-Host "  Category: $($product.category_id)" -ForegroundColor Gray
    Write-Host "  Available: $($product.available_quantity) $($product.unit_type)" -ForegroundColor Gray
    Write-Host "  Organic: $($product.is_organic)" -ForegroundColor Gray
    Write-Host "  Featured: $($product.is_featured)" -ForegroundColor Gray
    Write-Host ""
}

# Display Categories Data
Write-Host "=== CATEGORIES DATA ===" -ForegroundColor Yellow
$categories = Read-JsonFile "backend/data/categories.json"
foreach ($category in $categories) {
    Write-Host "Category ID: $($category.category_id)" -ForegroundColor Cyan
    Write-Host "  Name: $($category.category_name)" -ForegroundColor White
    Write-Host "  Description: $($category.category_description)" -ForegroundColor Gray
    Write-Host "  Active: $($category.is_active)" -ForegroundColor Gray
    Write-Host ""
}

# Display Users Data
Write-Host "=== USERS DATA ===" -ForegroundColor Yellow
$users = Read-JsonFile "backend/data/users.json"
foreach ($user in $users) {
    Write-Host "User ID: $($user.user_id)" -ForegroundColor Cyan
    Write-Host "  Name: $($user.first_name) $($user.last_name)" -ForegroundColor White
    Write-Host "  Email: $($user.email)" -ForegroundColor White
    Write-Host "  Mobile: $($user.mobile)" -ForegroundColor Gray
    Write-Host "  Verified: $($user.is_verified)" -ForegroundColor Gray
    Write-Host "  Active: $($user.is_active)" -ForegroundColor Gray
    Write-Host "  Created: $($user.created_at)" -ForegroundColor Gray
    Write-Host ""
}

# Display Orders Data
Write-Host "=== ORDERS DATA ===" -ForegroundColor Yellow
$orders = Read-JsonFile "backend/data/orders.json"
foreach ($order in $orders) {
    Write-Host "Order ID: $($order.order_id)" -ForegroundColor Cyan
    Write-Host "  Order Number: $($order.order_number)" -ForegroundColor White
    Write-Host "  User ID: $($order.user_id)" -ForegroundColor White
    Write-Host "  Status: $($order.order_status)" -ForegroundColor White
    Write-Host "  Payment: $($order.payment_status) ($($order.payment_method))" -ForegroundColor White
    Write-Host "  Total: ₹$($order.total_amount)" -ForegroundColor White
    Write-Host "  Delivery: $($order.delivery_date) at $($order.delivery_time_slot)" -ForegroundColor Gray
    Write-Host "  Created: $($order.created_at)" -ForegroundColor Gray
    Write-Host ""
}

# Display Summary Statistics
Write-Host "=== SUMMARY STATISTICS ===" -ForegroundColor Yellow
Write-Host "Total Products: $($products.Count)" -ForegroundColor White
Write-Host "Total Categories: $($categories.Count)" -ForegroundColor White
Write-Host "Total Users: $($users.Count)" -ForegroundColor White
Write-Host "Total Orders: $($orders.Count)" -ForegroundColor White

# Calculate order statistics
$totalRevenue = ($orders | Measure-Object -Property total_amount -Sum).Sum
$avgOrderValue = ($orders | Measure-Object -Property total_amount -Average).Average
$pendingOrders = ($orders | Where-Object { $_.order_status -eq "pending" }).Count
$deliveredOrders = ($orders | Where-Object { $_.order_status -eq "delivered" }).Count

Write-Host "Total Revenue: ₹$totalRevenue" -ForegroundColor Green
Write-Host "Average Order Value: ₹$([math]::Round($avgOrderValue, 2))" -ForegroundColor Green
Write-Host "Pending Orders: $pendingOrders" -ForegroundColor Yellow
Write-Host "Delivered Orders: $deliveredOrders" -ForegroundColor Green

Write-Host ""
Write-Host "=== API ENDPOINTS ===" -ForegroundColor Yellow
Write-Host "Health Check: http://localhost:5000/api/health" -ForegroundColor Gray
Write-Host "Products: http://localhost:5000/api/products" -ForegroundColor Gray
Write-Host "Categories: http://localhost:5000/api/categories" -ForegroundColor Gray
Write-Host "Users: http://localhost:5000/api/users" -ForegroundColor Gray
Write-Host "Orders: http://localhost:5000/api/orders" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 