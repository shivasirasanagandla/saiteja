-- =====================================================
-- DAIRY PRODUCTS WEBSITE - SIMPLIFIED DATABASE SCHEMA
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS dairy_products_db;
USE dairy_products_db;

-- =====================================================
-- USERS & AUTHENTICATION TABLES
-- =====================================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
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
    INDEX idx_product_id (product_id),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_quantity_available (quantity_available),
    INDEX idx_batch_number (batch_number)
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
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
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

-- =====================================================
-- DATABASE COMPLETED
-- ===================================================== 