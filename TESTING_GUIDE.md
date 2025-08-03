# 🧪 Testing and Usage Guide - Dairy Products Website

## 📋 Prerequisites

Before testing, ensure you have the following installed:

### Required Software
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Redis** (for session storage) - [Download here](https://redis.io/download)
- **Git** (for cloning) - [Download here](https://git-scm.com/)

### Verify Installations
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MySQL version
mysql --version

# Check Redis version
redis-server --version
```

## 🗄️ Step 1: Database Setup

### 1.1 Start MySQL Service
```bash
# Windows
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 1.2 Create Database
```bash
# Connect to MySQL as root
mysql -u root -p

# In MySQL console, create database
CREATE DATABASE dairy_products_db;
USE dairy_products_db;

# Exit MySQL
EXIT;
```

### 1.3 Import Database Schema
```bash
# Import the complete database schema
mysql -u root -p dairy_products_db < database_schema.sql
```

### 1.4 Verify Database Setup
```bash
# Connect to database
mysql -u root -p dairy_products_db

# Check tables
SHOW TABLES;

# Check sample data
SELECT * FROM products LIMIT 5;
SELECT * FROM users LIMIT 5;

# Exit
EXIT;
```

## ⚙️ Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Configure Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configurations
# Use any text editor to modify the values
```

### 2.4 Configure .env File
Edit the `.env` file with your specific values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dairy_products_db
DB_PORT=3306

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret_key_here

# Email Configuration (Optional for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# SMS Configuration (Optional for testing)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Payment Gateway Configuration (Optional for testing)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2.5 Start Redis Server
```bash
# Start Redis server
redis-server

# In a new terminal, test Redis
redis-cli ping
# Should return: PONG
```

### 2.6 Start Backend Server
```bash
# Start in development mode
npm run dev

# Or start in production mode
npm start
```

### 2.7 Verify Backend is Running
```bash
# Test the health endpoint
curl http://localhost:5000/health

# Should return: {"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

## 🎨 Step 3: Frontend Setup

### 3.1 Navigate to Project Root
```bash
cd ..
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Configure Frontend Environment
Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3.4 Start Frontend Development Server
```bash
npm start
```

### 3.5 Verify Frontend is Running
Open your browser and navigate to `http://localhost:3000`

## 🧪 Step 4: Testing the Complete System

### 4.1 Test User Registration/Login
1. **Open the website** at `http://localhost:3000`
2. **Click "Login"** in the header
3. **Register a new account** with:
   - Email: `test@example.com`
   - Mobile: `9876543210`
   - Password: `Test123!`
4. **Verify OTP** (check console for OTP code)
5. **Login successfully**

### 4.2 Test Product Browsing
1. **Navigate to Products section**
2. **Browse available dairy products**
3. **Check product details** (price, description, availability)
4. **Add items to cart**

### 4.3 Test Shopping Cart
1. **Add multiple products** to cart
2. **View cart** by clicking cart icon
3. **Update quantities**
4. **Remove items**
5. **Verify total calculation**

### 4.4 Test Order Placement
1. **Proceed to checkout**
2. **Fill delivery details**:
   - Address: `123 Test Street`
   - City: `Gurgaon`
   - Pincode: `122001`
   - Phone: `9876543210`
3. **Select delivery time slot**
4. **Choose payment method** (COD for testing)
5. **Place order**

### 4.5 Test Real-time Features
1. **Open browser console** (F12)
2. **Place an order**
3. **Watch for real-time updates** in console
4. **Check order status** updates
5. **Verify Socket.IO connections**

### 4.6 Test Order Tracking
1. **Go to "My Orders"** section
2. **Click on an order**
3. **View real-time tracking** updates
4. **Check order history**

## 🔍 Step 5: API Testing

### 5.1 Test Authentication APIs
```bash
# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "mobile": "9876543211",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test user login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 5.2 Test Product APIs
```bash
# Get all products
curl http://localhost:5000/api/products

# Get specific product
curl http://localhost:5000/api/products/1

# Search products
curl "http://localhost:5000/api/products/search?q=milk"
```

### 5.3 Test Order APIs (with authentication)
```bash
# First get a JWT token from login
TOKEN="your_jwt_token_here"

# Get user orders
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/orders

# Create new order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryAddressId": 1,
    "paymentMethod": "cod",
    "deliveryDate": "2024-01-15",
    "deliveryTimeSlot": "09:00-12:00",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }'
```

## 🐛 Step 6: Troubleshooting

### Common Issues and Solutions

#### 6.1 Database Connection Issues
```bash
# Check MySQL service
sudo systemctl status mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Test connection
mysql -u root -p dairy_products_db -e "SELECT 1;"
```

#### 6.2 Backend Server Issues
```bash
# Check if port 5000 is available
netstat -an | grep 5000

# Kill process using port 5000 (if needed)
sudo kill -9 $(lsof -t -i:5000)

# Check Node.js version
node --version
```

#### 6.3 Frontend Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 6.4 Redis Issues
```bash
# Check Redis service
redis-cli ping

# Restart Redis
sudo systemctl restart redis
```

### 6.5 Logs and Debugging
```bash
# Backend logs
cd backend
npm run dev

# Frontend logs
# Check browser console (F12)

# Database logs
sudo tail -f /var/log/mysql/error.log
```

## 📊 Step 7: Performance Testing

### 7.1 Load Testing
```bash
# Install Apache Bench (if not installed)
# Ubuntu/Debian: sudo apt-get install apache2-utils
# macOS: brew install httpd

# Test API endpoints
ab -n 100 -c 10 http://localhost:5000/health
ab -n 100 -c 10 http://localhost:5000/api/products
```

### 7.2 Database Performance
```bash
# Connect to MySQL
mysql -u root -p dairy_products_db

# Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';

# Check query performance
EXPLAIN SELECT * FROM products WHERE category_id = 1;
```

## 🚀 Step 8: Production Deployment

### 8.1 Environment Setup
```bash
# Set production environment
export NODE_ENV=production

# Update .env for production
# Use production database credentials
# Configure SSL certificates
# Set up proper domain names
```

### 8.2 Build Frontend
```bash
npm run build
```

### 8.3 Start Production Server
```bash
# Backend
cd backend
npm start

# Frontend (serve build folder)
npx serve -s build -l 3000
```

## 📱 Step 9: Mobile Testing

### 9.1 Responsive Design Testing
1. **Open browser developer tools** (F12)
2. **Toggle device toolbar**
3. **Test on different screen sizes**:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1200px+)

### 9.2 Mobile-Specific Features
1. **Test touch interactions**
2. **Verify swipe gestures**
3. **Check mobile navigation**
4. **Test mobile payment flow**

## 🔐 Step 10: Security Testing

### 10.1 Authentication Testing
```bash
# Test invalid credentials
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "wrong@email.com", "password": "wrongpass"}'

# Test protected endpoints without token
curl http://localhost:5000/api/orders
```

### 10.2 Input Validation Testing
```bash
# Test SQL injection attempts
curl "http://localhost:5000/api/products/search?q='; DROP TABLE products; --"

# Test XSS attempts
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "<script>alert(\"xss\")</script>@test.com"}'
```

## 📈 Step 11: Monitoring and Analytics

### 11.1 Real-time Monitoring
```bash
# Monitor backend logs
tail -f backend/logs/app.log

# Monitor database connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Monitor Redis memory usage
redis-cli info memory
```

### 11.2 Performance Metrics
- **Response times** for API calls
- **Database query performance**
- **Memory usage** of Node.js processes
- **Socket.IO connection count**

## ✅ Success Criteria

Your testing is successful when:

1. ✅ **Database**: All tables created, sample data loaded
2. ✅ **Backend**: Server running on port 5000, health check passes
3. ✅ **Frontend**: Website loads on port 3000, all pages functional
4. ✅ **Authentication**: User registration and login works
5. ✅ **Products**: Product browsing and cart functionality works
6. ✅ **Orders**: Order placement and tracking works
7. ✅ **Real-time**: Socket.IO connections established
8. ✅ **Mobile**: Responsive design works on mobile devices
9. ✅ **Security**: Protected endpoints require authentication
10. ✅ **Performance**: Page load times under 3 seconds

## 🎯 Next Steps

After successful testing:

1. **Customize the design** for your brand
2. **Add your dairy products** to the database
3. **Configure payment gateways** for real payments
4. **Set up SMS/Email services** for notifications
5. **Configure delivery zones** for your area
6. **Set up monitoring** and analytics
7. **Deploy to production** server

## 📞 Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify all services** are running
3. **Test each component** individually
4. **Review the troubleshooting** section above
5. **Check network connectivity** and firewall settings

---

**Happy Testing! 🥛✨** 