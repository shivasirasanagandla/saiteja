# 🥛 Dairy Products Website - Complete Setup Instructions

## 📋 Overview

This is a complete real-time dairy products e-commerce website with:
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: MySQL with real-time capabilities
- **Real-time Features**: Socket.IO for live updates
- **Payment Integration**: Multiple payment gateways
- **SMS/Email Notifications**: Twilio and Nodemailer
- **Inventory Management**: Real-time stock tracking
- **Order Tracking**: Live delivery updates

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MySQL** (v8.0 or higher)
3. **Redis** (for session storage and caching)
4. **Git**

### Step 1: Database Setup

1. **Install MySQL** and start the service
2. **Create the database**:
   ```sql
   CREATE DATABASE dairy_products_db;
   ```
3. **Run the database schema**:
   ```bash
   mysql -u root -p dairy_products_db < database_schema.sql
   ```

### Step 2: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=dairy_products_db
   
   # JWT Secret
   JWT_SECRET=your_super_secret_key_here
   
   # Email (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # SMS (Twilio) - Optional
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. **Start the backend server**:
   ```bash
   npm run dev
   ```
   
   The server will start on `http://localhost:5000`

### Step 3: Frontend Setup

1. **Navigate to project root**:
   ```bash
   cd ..
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start the frontend**:
   ```bash
   npm start
   ```
   
   The website will open on `http://localhost:3000`

## 🗄️ Database Structure

### Core Tables

1. **users** - Customer accounts and authentication
2. **products** - Dairy products catalog
3. **product_inventory** - Real-time stock management
4. **orders** - Order management
5. **order_items** - Individual items in orders
6. **order_tracking** - Real-time delivery tracking
7. **payments** - Payment processing
8. **notifications** - User notifications
9. **delivery_zones** - Delivery area management

### Key Features

- **Real-time Inventory**: Live stock updates
- **Order Tracking**: Live delivery status
- **Payment Processing**: Multiple payment methods
- **SMS/Email Notifications**: Automated alerts
- **User Management**: Authentication and profiles
- **Address Management**: Multiple delivery addresses

## 🔧 Configuration Options

### Database Configuration

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dairy_products_db
DB_PORT=3306
```

### Email Configuration (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Configure in `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

### SMS Configuration (Twilio)

1. Create a Twilio account
2. Get your Account SID and Auth Token
3. Configure in `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=your_number
   ```

### Payment Gateway Configuration

#### Stripe
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Razorpay
```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_key
```

## 🚀 Production Deployment

### Backend Deployment

1. **Set environment variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   ```

2. **Install PM2** (process manager):
   ```bash
   npm install -g pm2
   ```

3. **Start the application**:
   ```bash
   pm2 start server.js --name "dairy-backend"
   ```

### Frontend Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to your hosting service** (Netlify, Vercel, etc.)

### Database Deployment

1. **Use a managed MySQL service** (AWS RDS, Google Cloud SQL, etc.)
2. **Update database connection** in production environment
3. **Set up automated backups**

## 📱 Real-time Features

### Live Order Tracking

- Real-time order status updates
- Live delivery tracking
- Push notifications for status changes

### Inventory Management

- Live stock level updates
- Low stock alerts
- Automatic inventory adjustments

### User Notifications

- SMS notifications for order updates
- Email confirmations
- In-app notifications

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all inputs
- **CORS Protection**: Cross-origin request security
- **SQL Injection Prevention**: Parameterized queries

## 📊 Monitoring & Logging

### Logging Configuration

```env
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log
```

### Health Checks

- Database connectivity
- Redis connection
- External service status

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
npm test
```

## 📈 Performance Optimization

### Database Optimization

- Indexed queries for fast retrieval
- Connection pooling
- Query optimization

### Caching Strategy

- Redis for session storage
- Product cache
- User data cache

### CDN Configuration

- Static asset delivery
- Image optimization
- Global content distribution

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify database credentials
   - Ensure database exists

2. **Socket.IO Connection Issues**
   - Check CORS configuration
   - Verify Socket.IO server is running
   - Check firewall settings

3. **Payment Gateway Errors**
   - Verify API keys are correct
   - Check payment gateway status
   - Ensure proper webhook configuration

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

## 📞 Support

For technical support or questions:
- Check the documentation
- Review error logs
- Contact the development team

## 🎯 Next Steps

1. **Customize the design** to match your brand
2. **Configure payment gateways** for your region
3. **Set up SMS/Email services** for notifications
4. **Add more products** to the catalog
5. **Configure delivery zones** for your area
6. **Set up monitoring** and analytics
7. **Implement advanced features** like loyalty programs

---

**🎉 Congratulations!** Your real-time dairy products website is now ready to serve customers with live updates, secure payments, and professional order management. 