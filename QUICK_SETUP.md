# 🚀 Quick Setup Guide - Dairy Products Website

## ⚠️ Current Status
- ✅ Node.js: v22.16.0 (Working)
- ✅ npm: v10.9.2 (Working)
- ❌ MySQL: Not installed
- ❌ Redis: Not installed (Optional)

## 🎯 Quick Setup (Without Database)

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Create Frontend Environment
Create a `.env` file in the project root:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 3: Start Frontend
```bash
npm start
```

### Step 4: Test Frontend
Open http://localhost:3000 in your browser

## 🗄️ Database Setup (Required for Full Features)

### Install MySQL:
1. **Download MySQL**: https://dev.mysql.com/downloads/installer/
2. **Run Installer**: Choose "Developer Default"
3. **Set Root Password**: Remember this password!
4. **Start MySQL Service**: `net start mysql`

### After MySQL Installation:
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE dairy_products_db;"

# Import schema
mysql -u root -p dairy_products_db < database_schema.sql
```

## ⚙️ Backend Setup (After MySQL)

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Backend Environment
Create `.env` file in backend directory:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=dairy_products_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Session Configuration
SESSION_SECRET=your_session_secret_key_here
```

### Step 4: Start Backend
```bash
npm run dev
```

## 🧪 Testing Steps

### 1. Frontend Only (Current)
- ✅ Website loads at http://localhost:3000
- ✅ UI components work
- ❌ No backend functionality
- ❌ No database features

### 2. With Backend (After MySQL)
- ✅ Full website functionality
- ✅ User registration/login
- ✅ Product browsing
- ✅ Order placement
- ✅ Real-time features

## 🎯 Next Steps

1. **Install MySQL** for full functionality
2. **Set up the database** using the schema
3. **Configure backend** with proper credentials
4. **Test complete system**

## 📞 Help

If you need help:
1. **Install MySQL** first
2. **Follow the database setup** steps
3. **Configure backend** environment
4. **Test the complete system**

---

**Current Status**: Frontend ready, backend needs MySQL installation. 