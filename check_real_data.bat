@echo off
echo ========================================
echo CHECKING REAL USER DATA FROM WEBSITE
echo ========================================
echo.

echo 1. ALL USERS (Your login data):
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT user_id, first_name, last_name, email, mobile, is_verified, created_at FROM users;"

echo.
echo 2. ALL USER ADDRESSES (Your submitted addresses):
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT address_id, user_id, address_type, address_line1, city, state, is_default, created_at FROM user_addresses;"

echo.
echo 3. ALL ORDERS (Your placed orders):
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT order_id, order_number, user_id, order_status, payment_status, total_amount, delivery_date, created_at FROM orders;"

echo.
echo 4. ALL ORDER ITEMS (Products in your orders):
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT order_item_id, order_id, product_name, quantity, unit_price, total_price FROM order_items;"

echo.
echo 5. ALL PAYMENTS (Your payment records):
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT payment_id, order_id, payment_method, amount, payment_status, created_at FROM payments;"

echo.
echo 6. ALL OTP RECORDS (Your verification codes):
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT otp_id, user_id, mobile, email, otp_type, is_used, created_at FROM otp_verification;"

echo.
echo ========================================
echo REAL DATA CHECK COMPLETED!
echo ========================================
echo.
echo If you see empty results, it means:
echo 1. Your backend server might not be running
echo 2. The website might not be connected to database
echo 3. You need to complete the registration/login process
echo.
pause 