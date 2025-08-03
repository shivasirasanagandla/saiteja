@echo off
echo ========================================
echo TESTING DATABASE CONNECTION
echo ========================================
echo.

echo Testing MySQL connection...
mysql -u root -pYourStrongPassword@123 -e "SELECT 'MySQL Connection Successful!' as Status;"

echo.
echo ========================================
echo SHOWING DATABASES
echo ========================================
mysql -u root -pYourStrongPassword@123 -e "SHOW DATABASES;"

echo.
echo ========================================
echo SHOWING TABLES IN DAIRY_PRODUCTS_DB
echo ========================================
mysql -u root -pYourStrongPassword@123 -e "USE dairy_products_db; SHOW TABLES;"

echo.
echo ========================================
echo TESTING SAMPLE DATA
echo ========================================
mysql -u root -pYourStrongPassword@123 -e "USE dairy_products_db; SELECT product_name, base_price, sale_price FROM products LIMIT 5;"

echo.
echo ========================================
echo TESTING CATEGORIES
echo ========================================
mysql -u root -pYourStrongPassword@123 -e "USE dairy_products_db; SELECT category_name, category_description FROM product_categories;"

echo.
echo ========================================
echo DATABASE TEST COMPLETED!
echo ========================================
pause 