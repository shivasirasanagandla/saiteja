-- =====================================================
-- DAIRY PRODUCTS WEBSITE - COMPLETE DATABASE SCHEMA
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS dairy_products_db;
USE dairy_products_db;

-- =====================================================
-- USERS & AUTHENTICATION TABLES
-- =====================================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(15) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    profile_image VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_mobile (mobile),
    INDEX idx_created_at (created_at)
);

CREATE TABLE user_addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_type ENUM('home', 'office', 'other') DEFAULT 'home',
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_location (latitude, longitude)
);

CREATE TABLE otp_verification (
    otp_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    mobile VARCHAR(15),
    email VARCHAR(255),
    otp_code VARCHAR(6) NOT NULL,
    otp_type ENUM('login', 'registration', 'password_reset') NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_mobile_otp (mobile, otp_code),
    INDEX idx_email_otp (email, otp_code),
    INDEX idx_expires_at (expires_at)
);

-- =====================================================
-- PRODUCTS & INVENTORY TABLES
-- =====================================================

CREATE TABLE product_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    category_description TEXT,
    category_image VARCHAR(255),
    parent_category_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES product_categories(category_id) ON DELETE SET NULL,
    INDEX idx_parent_category (parent_category_id),
    INDEX idx_sort_order (sort_order)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_features JSON,
    product_image VARCHAR(255),
    product_gallery JSON,
    unit_type ENUM('liter', 'kg', 'gram', 'piece', 'pack') NOT NULL,
    unit_size DECIMAL(10, 2) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    is_organic BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    min_order_quantity INT DEFAULT 1,
    max_order_quantity INT DEFAULT 10,
    weight_grams DECIMAL(8, 2),
    dimensions_cm JSON,
    nutritional_info JSON,
    allergens JSON,
    storage_instructions TEXT,
    shelf_life_days INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(category_id),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_sku (sku),
    INDEX idx_price_range (base_price, sale_price)
);

CREATE TABLE product_inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    batch_number VARCHAR(100),
    production_date DATE,
    expiry_date DATE,
    quantity_available DECIMAL(10, 2) NOT NULL,
    quantity_reserved DECIMAL(10, 2) DEFAULT 0,
    quantity_sold DECIMAL(10, 2) DEFAULT 0,
    unit_cost DECIMAL(10, 2),
    supplier_name VARCHAR(255),
    quality_grade ENUM('A', 'B', 'C'),
    storage_location VARCHAR(255),
    temperature_maintained DECIMAL(5, 2),
    humidity_maintained DECIMAL(5, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_quantity_available (quantity_available),
    INDEX idx_batch_number (batch_number)
);

CREATE TABLE product_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    review_images JSON,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_helpful_count INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_product_review (user_id, product_id),
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- ORDERS & PAYMENTS TABLES
-- =====================================================

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    delivery_address_id INT NOT NULL,
    order_status ENUM('pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method ENUM('cod', 'online', 'card', 'upi', 'wallet') NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    delivery_date DATE,
    delivery_time_slot VARCHAR(50),
    special_instructions TEXT,
    cancellation_reason TEXT,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (delivery_address_id) REFERENCES user_addresses(address_id),
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at),
    INDEX idx_delivery_date (delivery_date)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    inventory_id INT,
    product_name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL,
    product_features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (inventory_id) REFERENCES product_inventory(inventory_id),
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method ENUM('cod', 'online', 'card', 'upi', 'wallet') NOT NULL,
    payment_gateway VARCHAR(100),
    transaction_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    gateway_response JSON,
    payment_date TIMESTAMP NULL,
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refund_date TIMESTAMP NULL,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_date (payment_date)
);

-- =====================================================
-- DELIVERY & TRACKING TABLES
-- =====================================================

CREATE TABLE delivery_zones (
    zone_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_name VARCHAR(100) NOT NULL,
    zone_description TEXT,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_time_slots JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
);

CREATE TABLE zone_coordinates (
    coordinate_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    sequence_order INT DEFAULT 0,
    FOREIGN KEY (zone_id) REFERENCES delivery_zones(zone_id) ON DELETE CASCADE,
    INDEX idx_zone_id (zone_id),
    INDEX idx_coordinates (latitude, longitude)
);

CREATE TABLE order_tracking (
    tracking_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    tracking_status ENUM('order_placed', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL,
    status_description TEXT,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    estimated_delivery_time TIMESTAMP NULL,
    actual_delivery_time TIMESTAMP NULL,
    delivery_agent_name VARCHAR(100),
    delivery_agent_phone VARCHAR(15),
    delivery_agent_id VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_tracking_status (tracking_status),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- NOTIFICATIONS & COMMUNICATIONS
-- =====================================================

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    notification_type ENUM('order_status', 'payment', 'delivery', 'promotion', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

CREATE TABLE sms_logs (
    sms_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    mobile_number VARCHAR(15) NOT NULL,
    message_type ENUM('otp', 'order_status', 'delivery', 'promotion') NOT NULL,
    message_text TEXT NOT NULL,
    sms_provider VARCHAR(100),
    provider_response JSON,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_mobile_number (mobile_number),
    INDEX idx_is_sent (is_sent),
    INDEX idx_created_at (created_at)
);

CREATE TABLE email_logs (
    email_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    email_address VARCHAR(255) NOT NULL,
    email_type ENUM('order_confirmation', 'order_status', 'delivery', 'promotion', 'password_reset') NOT NULL,
    subject VARCHAR(255) NOT NULL,
    email_content TEXT NOT NULL,
    email_provider VARCHAR(100),
    provider_response JSON,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_email_address (email_address),
    INDEX idx_is_sent (is_sent),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- ANALYTICS & REPORTS
-- =====================================================

CREATE TABLE user_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type ENUM('mobile', 'tablet', 'desktop') DEFAULT 'desktop',
    browser VARCHAR(100),
    os VARCHAR(100),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_login_time (login_time)
);

CREATE TABLE product_views (
    view_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT,
    session_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    view_duration_seconds INT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_viewed_at (viewed_at)
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert Product Categories
INSERT INTO product_categories (category_name, category_description, sort_order) VALUES
('Fresh Milk', 'Pure and fresh dairy milk products', 1),
('Curd & Yogurt', 'Fresh curd and yogurt varieties', 2),
('Butter & Ghee', 'Pure butter and clarified ghee', 3),
('Cheese', 'Fresh cheese varieties', 4),
('Cream', 'Fresh cream products', 5),
('Paneer', 'Fresh cottage cheese', 6),
('Lassi & Drinks', 'Traditional dairy beverages', 7);

-- Insert Products
INSERT INTO products (category_id, product_name, product_description, unit_type, unit_size, base_price, sale_price, cost_price, sku, is_organic, is_featured, min_order_quantity, max_order_quantity, weight_grams, nutritional_info, storage_instructions, shelf_life_days) VALUES
(1, 'Fresh Full Cream Milk', 'Pure and fresh full cream milk from grass-fed cows', 'liter', 1.0, 60.00, 55.00, 45.00, 'MILK-FC-1L', TRUE, TRUE, 1, 5, 1030, '{"protein": "3.2g", "fat": "3.5g", "calories": "65"}', 'Keep refrigerated at 2-4°C', 2),
(1, 'Toned Milk', 'Low-fat toned milk for health-conscious consumers', 'liter', 1.0, 50.00, 45.00, 38.00, 'MILK-TONED-1L', FALSE, FALSE, 1, 5, 1030, '{"protein": "3.1g", "fat": "2.0g", "calories": "50"}', 'Keep refrigerated at 2-4°C', 2),
(2, 'Fresh Curd', 'Traditional homemade style fresh curd', 'kg', 0.5, 40.00, 35.00, 25.00, 'CURD-FRESH-500G', TRUE, TRUE, 1, 3, 500, '{"protein": "3.5g", "fat": "3.0g", "calories": "60"}', 'Keep refrigerated at 2-4°C', 3),
(3, 'Pure Butter', 'Fresh churned butter from cream', 'kg', 0.25, 120.00, 110.00, 85.00, 'BUTTER-PURE-250G', TRUE, FALSE, 1, 2, 250, '{"protein": "0.9g", "fat": "81g", "calories": "717"}', 'Keep refrigerated at 2-4°C', 7),
(3, 'Organic Ghee', 'Pure clarified butter ghee', 'kg', 0.5, 200.00, 180.00, 150.00, 'GHEE-ORG-500G', TRUE, TRUE, 1, 2, 500, '{"protein": "0g", "fat": "100g", "calories": "900"}', 'Store in cool, dry place', 180),
(4, 'Fresh Paneer', 'Soft and fresh cottage cheese', 'kg', 0.25, 80.00, 70.00, 55.00, 'PANEER-FRESH-250G', TRUE, TRUE, 1, 2, 250, '{"protein": "18g", "fat": "20g", "calories": "265"}', 'Keep refrigerated at 2-4°C', 3),
(5, 'Fresh Cream', 'Rich and thick fresh cream', 'liter', 0.5, 80.00, 70.00, 60.00, 'CREAM-FRESH-500ML', TRUE, FALSE, 1, 2, 515, '{"protein": "2.5g", "fat": "35g", "calories": "340"}', 'Keep refrigerated at 2-4°C', 5),
(7, 'Sweet Lassi', 'Traditional sweet yogurt drink', 'liter', 0.5, 40.00, 35.00, 25.00, 'LASSI-SWEET-500ML', FALSE, FALSE, 1, 3, 515, '{"protein": "2.8g", "fat": "2.5g", "calories": "85"}', 'Keep refrigerated at 2-4°C', 1);

-- Insert Delivery Zones
INSERT INTO delivery_zones (zone_name, zone_description, delivery_fee, min_order_amount, delivery_time_slots) VALUES
('Central City', 'Central business district and surrounding areas', 30.00, 100.00, '["09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"]'),
('North Zone', 'Northern residential areas', 40.00, 150.00, '["09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"]'),
('South Zone', 'Southern residential areas', 40.00, 150.00, '["09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"]'),
('East Zone', 'Eastern residential areas', 50.00, 200.00, '["09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"]'),
('West Zone', 'Western residential areas', 50.00, 200.00, '["09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"]');

-- Insert Inventory
INSERT INTO product_inventory (product_id, batch_number, production_date, expiry_date, quantity_available, unit_cost, supplier_name, quality_grade, storage_location, temperature_maintained, humidity_maintained) VALUES
(1, 'BATCH-FC-2024-001', '2024-01-15', '2024-01-17', 100.0, 45.00, 'Local Dairy Farm', 'A', 'Cold Storage A', 3.5, 85.0),
(2, 'BATCH-TONED-2024-001', '2024-01-15', '2024-01-17', 150.0, 38.00, 'Local Dairy Farm', 'A', 'Cold Storage B', 3.0, 80.0),
(3, 'BATCH-CURD-2024-001', '2024-01-14', '2024-01-17', 50.0, 25.00, 'Local Dairy Farm', 'A', 'Cold Storage A', 4.0, 90.0),
(4, 'BATCH-BUTTER-2024-001', '2024-01-10', '2024-01-17', 25.0, 85.00, 'Local Dairy Farm', 'A', 'Cold Storage C', 2.5, 75.0),
(5, 'BATCH-GHEE-2024-001', '2024-01-05', '2024-07-05', 30.0, 150.00, 'Local Dairy Farm', 'A', 'Dry Storage A', 25.0, 45.0),
(6, 'BATCH-PANEER-2024-001', '2024-01-15', '2024-01-18', 40.0, 55.00, 'Local Dairy Farm', 'A', 'Cold Storage A', 3.5, 85.0),
(7, 'BATCH-CREAM-2024-001', '2024-01-15', '2024-01-20', 30.0, 60.00, 'Local Dairy Farm', 'A', 'Cold Storage B', 3.0, 80.0),
(8, 'BATCH-LASSI-2024-001', '2024-01-15', '2024-01-16', 60.0, 25.00, 'Local Dairy Farm', 'A', 'Cold Storage A', 4.0, 90.0);

-- =====================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- =====================================================

DELIMITER //

-- Procedure to create a new order
CREATE PROCEDURE CreateOrder(
    IN p_user_id INT,
    IN p_delivery_address_id INT,
    IN p_payment_method ENUM('cod', 'online', 'card', 'upi', 'wallet'),
    IN p_delivery_date DATE,
    IN p_delivery_time_slot VARCHAR(50),
    IN p_special_instructions TEXT,
    OUT p_order_id INT
)
BEGIN
    DECLARE v_order_number VARCHAR(50);
    DECLARE v_subtotal DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_tax_amount DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_delivery_fee DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_total_amount DECIMAL(10, 2) DEFAULT 0;
    
    -- Generate order number
    SET v_order_number = CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0'));
    
    -- Create order
    INSERT INTO orders (order_number, user_id, delivery_address_id, payment_method, delivery_date, delivery_time_slot, special_instructions)
    VALUES (v_order_number, p_user_id, p_delivery_address_id, p_payment_method, p_delivery_date, p_delivery_time_slot, p_special_instructions);
    
    SET p_order_id = LAST_INSERT_ID();
    
    -- Calculate totals (this would be updated when items are added)
    UPDATE orders 
    SET subtotal = v_subtotal,
        tax_amount = v_tax_amount,
        delivery_fee = v_delivery_fee,
        total_amount = v_subtotal + v_tax_amount + v_delivery_fee
    WHERE order_id = p_order_id;
END //

-- Procedure to add item to order
CREATE PROCEDURE AddOrderItem(
    IN p_order_id INT,
    IN p_product_id INT,
    IN p_quantity DECIMAL(10, 2),
    OUT p_order_item_id INT
)
BEGIN
    DECLARE v_product_name VARCHAR(255);
    DECLARE v_unit_price DECIMAL(10, 2);
    DECLARE v_unit_type VARCHAR(50);
    DECLARE v_total_price DECIMAL(10, 2);
    DECLARE v_inventory_id INT;
    DECLARE v_available_quantity DECIMAL(10, 2);
    
    -- Get product details
    SELECT product_name, sale_price, unit_type 
    INTO v_product_name, v_unit_price, v_unit_type
    FROM products 
    WHERE product_id = p_product_id AND is_active = TRUE;
    
    -- Check inventory availability
    SELECT inventory_id, quantity_available
    INTO v_inventory_id, v_available_quantity
    FROM product_inventory 
    WHERE product_id = p_product_id 
    AND quantity_available >= p_quantity 
    AND is_active = TRUE
    ORDER BY expiry_date ASC
    LIMIT 1;
    
    IF v_inventory_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient inventory for this product';
    END IF;
    
    -- Calculate total price
    SET v_total_price = v_unit_price * p_quantity;
    
    -- Add order item
    INSERT INTO order_items (order_id, product_id, inventory_id, product_name, unit_price, quantity, unit_type, total_price, final_price)
    VALUES (p_order_id, p_product_id, v_inventory_id, v_product_name, v_unit_price, p_quantity, v_unit_type, v_total_price, v_total_price);
    
    SET p_order_item_id = LAST_INSERT_ID();
    
    -- Update inventory
    UPDATE product_inventory 
    SET quantity_available = quantity_available - p_quantity,
        quantity_reserved = quantity_reserved + p_quantity
    WHERE inventory_id = v_inventory_id;
    
    -- Update order totals
    UPDATE orders 
    SET subtotal = (
        SELECT SUM(final_price) 
        FROM order_items 
        WHERE order_id = p_order_id
    ),
    total_amount = subtotal + tax_amount + delivery_fee
    WHERE order_id = p_order_id;
END //

-- Procedure to update order status
CREATE PROCEDURE UpdateOrderStatus(
    IN p_order_id INT,
    IN p_new_status ENUM('pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'),
    IN p_status_description TEXT,
    IN p_location VARCHAR(255),
    IN p_delivery_agent_name VARCHAR(100),
    IN p_delivery_agent_phone VARCHAR(15)
)
BEGIN
    DECLARE v_current_status VARCHAR(50);
    
    -- Get current status
    SELECT order_status INTO v_current_status FROM orders WHERE order_id = p_order_id;
    
    -- Update order status
    UPDATE orders SET order_status = p_new_status WHERE order_id = p_order_id;
    
    -- Add tracking entry
    INSERT INTO order_tracking (order_id, tracking_status, status_description, location, delivery_agent_name, delivery_agent_phone)
    VALUES (p_order_id, p_new_status, p_status_description, p_location, p_delivery_agent_name, p_delivery_agent_phone);
    
    -- If delivered, update delivery time
    IF p_new_status = 'delivered' THEN
        UPDATE order_tracking 
        SET actual_delivery_time = NOW() 
        WHERE order_id = p_order_id AND tracking_status = 'delivered';
    END IF;
END //

-- Procedure to check inventory availability
CREATE PROCEDURE CheckInventoryAvailability(
    IN p_product_id INT,
    OUT p_available_quantity DECIMAL(10, 2),
    OUT p_is_available BOOLEAN
)
BEGIN
    SELECT COALESCE(SUM(quantity_available), 0)
    INTO p_available_quantity
    FROM product_inventory 
    WHERE product_id = p_product_id 
    AND is_active = TRUE 
    AND expiry_date > CURDATE();
    
    SET p_is_available = (p_available_quantity > 0);
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

DELIMITER //

-- Trigger to update product inventory when order is cancelled
CREATE TRIGGER after_order_cancelled
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_status = 'cancelled' AND OLD.order_status != 'cancelled' THEN
        -- Restore inventory
        UPDATE product_inventory pi
        JOIN order_items oi ON pi.inventory_id = oi.inventory_id
        SET pi.quantity_available = pi.quantity_available + oi.quantity,
            pi.quantity_reserved = pi.quantity_reserved - oi.quantity
        WHERE oi.order_id = NEW.order_id;
    END IF;
END //

-- Trigger to update product inventory when order is delivered
CREATE TRIGGER after_order_delivered
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_status = 'delivered' AND OLD.order_status != 'delivered' THEN
        -- Update sold quantity
        UPDATE product_inventory pi
        JOIN order_items oi ON pi.inventory_id = oi.inventory_id
        SET pi.quantity_sold = pi.quantity_sold + oi.quantity,
            pi.quantity_reserved = pi.quantity_reserved - oi.quantity
        WHERE oi.order_id = NEW.order_id;
    END IF;
END //

-- Trigger to create notification when order status changes
CREATE TRIGGER after_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_status != OLD.order_status THEN
        INSERT INTO notifications (user_id, notification_type, title, message)
        VALUES (
            NEW.user_id,
            'order_status',
            CONCAT('Order #', NEW.order_number, ' Status Updated'),
            CONCAT('Your order #', NEW.order_number, ' status has been updated to: ', NEW.order_status)
        );
    END IF;
END //

DELIMITER ;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for available products with inventory
CREATE VIEW available_products AS
SELECT 
    p.product_id,
    p.product_name,
    p.product_description,
    p.product_image,
    p.unit_type,
    p.unit_size,
    p.base_price,
    p.sale_price,
    p.is_organic,
    p.is_featured,
    p.min_order_quantity,
    p.max_order_quantity,
    c.category_name,
    COALESCE(SUM(pi.quantity_available), 0) as available_quantity,
    p.is_active
FROM products p
LEFT JOIN product_categories c ON p.category_id = c.category_id
LEFT JOIN product_inventory pi ON p.product_id = pi.product_id AND pi.is_active = TRUE AND pi.expiry_date > CURDATE()
WHERE p.is_active = TRUE
GROUP BY p.product_id
HAVING available_quantity > 0;

-- View for order summary
CREATE VIEW order_summary AS
SELECT 
    o.order_id,
    o.order_number,
    o.user_id,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    u.mobile,
    u.email,
    o.order_status,
    o.payment_status,
    o.total_amount,
    o.delivery_date,
    o.delivery_time_slot,
    o.created_at,
    COUNT(oi.order_item_id) as total_items
FROM orders o
JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id;

-- View for inventory alerts
CREATE VIEW inventory_alerts AS
SELECT 
    p.product_id,
    p.product_name,
    p.sku,
    c.category_name,
    COALESCE(SUM(pi.quantity_available), 0) as available_quantity,
    COALESCE(SUM(pi.quantity_reserved), 0) as reserved_quantity,
    COALESCE(SUM(pi.quantity_sold), 0) as sold_quantity,
    MIN(pi.expiry_date) as earliest_expiry
FROM products p
LEFT JOIN product_categories c ON p.category_id = c.category_id
LEFT JOIN product_inventory pi ON p.product_id = pi.product_id AND pi.is_active = TRUE
WHERE p.is_active = TRUE
GROUP BY p.product_id
HAVING available_quantity <= 10 OR earliest_expiry <= DATE_ADD(CURDATE(), INTERVAL 3 DAY);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better performance
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_orders_created_date ON orders(created_at, order_status);
CREATE INDEX idx_inventory_product_expiry ON product_inventory(product_id, expiry_date, is_active);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_tracking_order_status ON order_tracking(order_id, tracking_status, created_at);

-- =====================================================
-- DATABASE COMPLETED
-- ===================================================== 