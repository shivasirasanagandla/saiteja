# Nature's Dairy - Database Documentation

## 📋 **Database Overview**

The MySQL database for Nature's Dairy website is designed to support a complete e-commerce platform for fresh organic A2 milk and dairy products. The database handles user management, product catalog, orders, payments, subscriptions, and administrative functions.

**Database Name**: `natures_dairy`

---

## 🏗️ **Database Schema**

### **Core Tables**

#### **1. Users Management**
- **`users`** - Customer accounts and authentication
- **`user_addresses`** - Multiple delivery addresses per user
- **`admin_users`** - Administrative staff accounts

#### **2. Product Management**
- **`product_categories`** - Product categorization (Milk, Ghee, Paneer)
- **`products`** - Product catalog with pricing and features
- **`product_images`** - Product image gallery

#### **3. Order Management**
- **`orders`** - Order headers with status and payment info
- **`order_items`** - Individual items in each order
- **`shopping_cart`** - User shopping cart items
- **`user_wishlist`** - User wishlist items

#### **4. Payment & Delivery**
- **`payments`** - Payment transaction records
- **`delivery_areas`** - Serviceable areas and delivery fees

#### **5. Customer Experience**
- **`customer_reviews`** - Product reviews and ratings
- **`subscriptions`** - Recurring delivery subscriptions
- **`notifications`** - User notifications system

#### **6. System Management**
- **`system_settings`** - Configurable system parameters

---

## 📊 **Table Details**

### **Users Table**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other') DEFAULT 'other',
    profile_image VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

**Purpose**: Stores customer account information
**Key Features**:
- Email and mobile number validation
- Profile image support
- Account verification status
- Last login tracking

### **Products Table**
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    unit VARCHAR(20) NOT NULL DEFAULT 'piece',
    min_order_quantity INT DEFAULT 1,
    max_order_quantity INT DEFAULT 10,
    stock_quantity INT DEFAULT 0,
    is_subscription_available BOOLEAN DEFAULT FALSE,
    subscription_discount DECIMAL(5,2) DEFAULT 0.00,
    badge VARCHAR(50),
    icon VARCHAR(50),
    features JSON,
    nutritional_info JSON,
    shelf_life VARCHAR(100),
    availability_schedule JSON,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE
);
```

**Purpose**: Product catalog with detailed information
**Key Features**:
- JSON fields for flexible features and nutritional info
- Subscription support with discounts
- Stock quantity tracking
- Availability scheduling

### **Orders Table**
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    order_status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method ENUM('cod', 'online', 'upi', 'card') DEFAULT 'cod',
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 50.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_date DATE,
    delivery_time_slot VARCHAR(50),
    special_instructions TEXT,
    cancellation_reason TEXT
);
```

**Purpose**: Order management with status tracking
**Key Features**:
- Automatic order number generation
- Multiple payment methods
- Delivery scheduling
- Status tracking for order lifecycle

---

## 🔗 **Relationships**

### **Primary Relationships**
1. **Users → Orders** (1:N) - One user can have multiple orders
2. **Users → Addresses** (1:N) - One user can have multiple addresses
3. **Products → Order Items** (1:N) - One product can be in multiple orders
4. **Orders → Order Items** (1:N) - One order can have multiple items
5. **Categories → Products** (1:N) - One category can have multiple products

### **Foreign Key Constraints**
- All relationships maintain referential integrity
- Cascade deletes for dependent records
- Proper indexing for performance

---

## 📈 **Views for Analytics**

### **1. Active Products View**
```sql
CREATE VIEW active_products AS
SELECT 
    p.*,
    c.name as category_name,
    c.icon as category_icon
FROM products p
JOIN product_categories c ON p.category_id = c.id
WHERE p.is_active = TRUE AND c.is_active = TRUE
ORDER BY p.sort_order, p.name;
```

### **2. Order Summary View**
```sql
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.user_id,
    u.first_name,
    u.last_name,
    u.email,
    o.order_status,
    o.payment_status,
    o.total_amount,
    o.created_at,
    COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;
```

### **3. Product Reviews Summary View**
```sql
CREATE VIEW product_reviews_summary AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    COUNT(r.id) as total_reviews,
    AVG(r.rating) as average_rating,
    COUNT(CASE WHEN r.rating = 5 THEN 1 END) as five_star_count
FROM products p
LEFT JOIN customer_reviews r ON p.id = r.product_id AND r.is_approved = TRUE
GROUP BY p.id;
```

---

## ⚡ **Performance Optimizations**

### **Indexes**
```sql
-- User queries
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_mobile ON users(mobile);
CREATE INDEX idx_active ON users(is_active);

-- Order queries
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_orders_created_status ON orders(created_at, order_status);
CREATE INDEX idx_order_number ON orders(order_number);

-- Product queries
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);

-- Review queries
CREATE INDEX idx_reviews_product_rating ON customer_reviews(product_id, rating);
```

### **Triggers**
1. **Stock Management**: Automatically updates product stock when orders are placed
2. **Order Number Generation**: Automatically generates unique order numbers
3. **Subscription Delivery**: Updates next delivery dates for subscriptions

---

## 🔧 **Sample Queries**

### **Get User Orders with Items**
```sql
SELECT 
    o.order_number,
    o.order_status,
    o.total_amount,
    o.created_at,
    GROUP_CONCAT(CONCAT(oi.product_name, ' (', oi.quantity, ')') SEPARATOR ', ') as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = ?
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### **Get Featured Products with Reviews**
```sql
SELECT 
    p.*,
    c.name as category_name,
    COALESCE(prs.average_rating, 0) as avg_rating,
    COALESCE(prs.total_reviews, 0) as review_count
FROM products p
JOIN product_categories c ON p.category_id = c.id
LEFT JOIN product_reviews_summary prs ON p.id = prs.product_id
WHERE p.is_featured = TRUE AND p.is_active = TRUE
ORDER BY p.sort_order;
```

### **Get User Shopping Cart**
```sql
SELECT 
    sc.*,
    p.name as product_name,
    p.price as product_price,
    p.icon as product_icon,
    p.badge as product_badge
FROM shopping_cart sc
JOIN products p ON sc.product_id = p.id
WHERE sc.user_id = ?
ORDER BY sc.created_at DESC;
```

### **Get System Settings**
```sql
SELECT 
    setting_key,
    setting_value,
    setting_type,
    description
FROM system_settings
WHERE is_public = TRUE
ORDER BY setting_key;
```

---

## 🛡️ **Security Features**

### **Data Protection**
- Password hashing for user authentication
- Input validation and sanitization
- SQL injection prevention through prepared statements
- Access control through admin user roles

### **Audit Trail**
- Timestamps on all major tables
- User activity tracking
- Order status change history
- Payment transaction logs

---

## 📊 **Data Management**

### **Backup Strategy**
```sql
-- Daily backup command
mysqldump -u username -p mammary_glands_dairy > backup_$(date +%Y%m%d).sql
```

### **Data Archiving**
- Old orders can be archived after 2 years
- Inactive users can be archived after 1 year
- Payment records retained for 7 years (compliance)

### **Data Cleanup**
```sql
-- Clean up old notifications
DELETE FROM notifications 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH) 
AND is_read = TRUE;

-- Clean up expired sessions
DELETE FROM user_sessions 
WHERE last_activity < DATE_SUB(NOW(), INTERVAL 24 HOUR);
```

---

## 🚀 **Deployment Instructions**

### **1. Database Setup**
```bash
# Create database
mysql -u root -p < database_schema.sql

# Verify tables
mysql -u root -p -e "USE mammary_glands_dairy; SHOW TABLES;"
```

### **2. Environment Configuration**
```env
# Database connection
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mammary_glands_dairy
DB_USER=your_username
DB_PASSWORD=your_password
```

### **3. Application Integration**
```javascript
// Example Node.js connection
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
```

---

## 📋 **Maintenance Tasks**

### **Daily Tasks**
- Monitor order status updates
- Check stock levels
- Process subscription deliveries
- Send notification reminders

### **Weekly Tasks**
- Generate sales reports
- Update product availability
- Review customer feedback
- Backup database

### **Monthly Tasks**
- Performance optimization
- Data archiving
- Security updates
- System maintenance

---

## 🔍 **Troubleshooting**

### **Common Issues**
1. **Connection Issues**: Check database credentials and network
2. **Performance Issues**: Review query execution plans
3. **Data Integrity**: Verify foreign key constraints
4. **Backup Issues**: Check disk space and permissions

### **Monitoring Queries**
```sql
-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'mammary_glands_dairy'
GROUP BY table_schema;

-- Check slow queries
SHOW PROCESSLIST;

-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'mammary_glands_dairy'
ORDER BY (data_length + index_length) DESC;
```

---

**Database Version**: 1.0  
**Last Updated**: July 2024  
**Compatibility**: MySQL 8.0+  
**Total Tables**: 15  
**Total Views**: 3  
**Total Indexes**: 25+ 