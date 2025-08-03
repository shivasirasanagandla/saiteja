@echo off
echo ========================================
echo VIEWING USERS DATA IN MYSQL DATABASE
echo ========================================
echo.

echo 1. USERS TABLE:
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT user_id, first_name, last_name, email, mobile, is_verified, is_active, created_at FROM users;"

echo.
echo 2. USER ADDRESSES:
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT address_id, user_id, address_type, city, state, is_default FROM user_addresses;"

echo.
echo 3. OTP VERIFICATION:
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SELECT otp_id, user_id, mobile, email, otp_type, is_used, expires_at FROM otp_verification;"

echo.
echo 4. ALL TABLES IN DATABASE:
echo ========================================
mysql -u root -pYourStrongPassword@123 dairy_products_db -e "SHOW TABLES;"

echo.
echo ========================================
echo USERS DATA VIEWING COMPLETED!
echo ========================================
pause 