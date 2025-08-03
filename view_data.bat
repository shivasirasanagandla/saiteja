@echo off
echo ========================================
echo VIEWING STORED DATA IN MYSQL DATABASE
echo ========================================
echo.

echo 1. PRODUCTS TABLE:
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT product_id, product_name, base_price, sale_price, unit_type FROM products;"

echo.
echo 2. PRODUCT CATEGORIES:
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT category_id, category_name, category_description FROM product_categories;"

echo.
echo 3. INVENTORY:
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT product_id, batch_number, quantity_available, expiry_date FROM product_inventory;"

echo.
echo 4. DELIVERY ZONES:
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT zone_id, zone_name, delivery_fee FROM delivery_zones;"

echo.
echo ========================================
echo DATA VIEWING COMPLETED!
echo ========================================
pause 