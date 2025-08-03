#!/bin/bash

# 🥛 Dairy Products Website - Quick Setup Script
# This script automates the setup process for testing the complete dairy products website

echo "🥛 Starting Dairy Products Website Setup..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required software is installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js v16 or higher."
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm."
        exit 1
    fi
    
    # Check MySQL
    if command -v mysql &> /dev/null; then
        print_success "MySQL found"
    else
        print_warning "MySQL not found. Please install MySQL v8.0 or higher."
    fi
    
    # Check Redis
    if command -v redis-server &> /dev/null; then
        print_success "Redis found"
    else
        print_warning "Redis not found. Please install Redis."
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if MySQL is running
    if ! mysqladmin ping -h localhost -u root --password="" &> /dev/null; then
        print_warning "MySQL service not running. Please start MySQL service."
        print_status "On Windows: net start mysql"
        print_status "On macOS: brew services start mysql"
        print_status "On Linux: sudo systemctl start mysql"
        return 1
    fi
    
    # Create database
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS dairy_products_db;" 2>/dev/null
    if [ $? -eq 0 ]; then
        print_success "Database created successfully"
    else
        print_error "Failed to create database. Please check MySQL credentials."
        return 1
    fi
    
    # Import schema
    if [ -f "database_schema.sql" ]; then
        mysql -u root -p dairy_products_db < database_schema.sql
        if [ $? -eq 0 ]; then
            print_success "Database schema imported successfully"
        else
            print_error "Failed to import database schema"
            return 1
        fi
    else
        print_error "database_schema.sql not found"
        return 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    # Create backend directory if it doesn't exist
    if [ ! -d "backend" ]; then
        mkdir -p backend
    fi
    
    cd backend
    
    # Create package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        print_status "Creating package.json..."
        cat > package.json << 'EOF'
{
  "name": "dairy-products-backend",
  "version": "1.0.0",
  "description": "Real-time dairy products e-commerce backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "twilio": "^4.19.0",
    "socket.io": "^4.7.4",
    "redis": "^4.6.10",
    "dotenv": "^16.3.1",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "winston": "^3.11.0",
    "joi": "^17.11.0",
    "moment": "^2.29.4",
    "uuid": "^9.0.1",
    "sharp": "^0.32.6",
    "aws-sdk": "^2.1473.0",
    "stripe": "^13.10.0",
    "razorpay": "^2.8.6",
    "node-cron": "^3.0.3",
    "express-session": "^1.17.3",
    "connect-redis": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
EOF
    fi
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cat > .env << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dairy_products_db
DB_PORT=3306

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret_key_here_change_this_in_production

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
EOF
        print_warning "Please update the .env file with your specific configurations"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating frontend .env file..."
        cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
EOF
    fi
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start Redis if available
    if command -v redis-server &> /dev/null; then
        print_status "Starting Redis server..."
        redis-server --daemonize yes
        sleep 2
        if redis-cli ping &> /dev/null; then
            print_success "Redis server started"
        else
            print_warning "Failed to start Redis server"
        fi
    fi
    
    # Start backend
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Test backend
    if curl -s http://localhost:5000/health &> /dev/null; then
        print_success "Backend server started successfully"
    else
        print_warning "Backend server may not be running properly"
    fi
    
    # Start frontend
    print_status "Starting frontend server..."
    npm start &
    FRONTEND_PID=$!
    
    print_success "All services started!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000"
    print_status "Health Check: http://localhost:5000/health"
}

# Main setup function
main() {
    echo ""
    print_status "Starting complete setup process..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    echo ""
    
    # Setup database
    setup_database
    echo ""
    
    # Setup backend
    setup_backend
    echo ""
    
    # Setup frontend
    setup_frontend
    echo ""
    
    # Start services
    start_services
    echo ""
    
    print_success "Setup completed successfully!"
    echo ""
    print_status "Next steps:"
    print_status "1. Open http://localhost:3000 in your browser"
    print_status "2. Register a new account"
    print_status "3. Browse products and place test orders"
    print_status "4. Check real-time features"
    echo ""
    print_status "For detailed testing instructions, see TESTING_GUIDE.md"
    echo ""
    
    # Save PIDs for cleanup
    echo $BACKEND_PID > .backend_pid
    echo $FRONTEND_PID > .frontend_pid
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    
    if [ -f ".backend_pid" ]; then
        BACKEND_PID=$(cat .backend_pid)
        kill $BACKEND_PID 2>/dev/null
        rm .backend_pid
    fi
    
    if [ -f ".frontend_pid" ]; then
        FRONTEND_PID=$(cat .frontend_pid)
        kill $FRONTEND_PID 2>/dev/null
        rm .frontend_pid
    fi
    
    print_success "Cleanup completed"
}

# Handle script interruption
trap cleanup EXIT

# Run main function
main "$@" 