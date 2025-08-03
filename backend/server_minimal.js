const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory data storage
let users = [];
let products = [
  {
    "id": 1,
    "name": "Fresh Milk",
    "description": "Pure and fresh cow milk, rich in calcium and protein",
    "price": 60,
    "unit": "liter",
    "category": "milk",
    "image": "/images/freshmilk.jpeg",
    "featured": true,
    "inStock": true,
    "badge": "Fresh",
    "features": ["High in calcium", "Rich in protein", "Natural"]
  },
  {
    "id": 2,
    "name": "Toned Milk",
    "description": "Low-fat milk perfect for health-conscious consumers",
    "price": 50,
    "unit": "liter",
    "category": "milk",
    "image": "/images/toned milk.jpg",
    "featured": true,
    "inStock": true,
    "badge": "Low Fat",
    "features": ["Low fat", "High protein", "Healthy"]
  },
  {
    "id": 3,
    "name": "Curd",
    "description": "Fresh homemade curd with live cultures",
    "price": 40,
    "unit": "kg",
    "category": "curd",
    "image": "/images/curd.jpeg",
    "featured": true,
    "inStock": true,
    "badge": "Probiotic",
    "features": ["Live cultures", "Probiotic", "Fresh"]
  }
];

let orders = [];

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: users.length,
    products: products.length,
    orders: orders.length
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);
    
    const { email, password, firstName, lastName, mobile } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user (simple password storage for demo)
    const newUser = {
      id: users.length + 1,
      email,
      password: password, // In production, hash this
      firstName,
      lastName,
      mobile: mobile || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate simple token
    const token = `token_${newUser.id}_${Date.now()}`;

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    console.log('✅ User registered successfully:', userResponse.email);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate simple token
    const token = `token_${user.id}_${Date.now()}`;

    // Remove password from response
    const { password: _, ...userResponse } = user;

    console.log('✅ User logged in successfully:', userResponse.email);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log('📱 OTP sent to:', mobile, 'OTP:', otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp.toString()
    });

  } catch (error) {
    console.error('❌ Send OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ error: 'Mobile and OTP are required' });
    }

    // Accept any 6-digit OTP for demo
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      // Find or create user
      let user = users.find(u => u.mobile === mobile);
      
      if (!user) {
        user = {
          id: users.length + 1,
          email: null,
          mobile,
          firstName: 'User',
          lastName: 'Mobile',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        users.push(user);
      }

      const token = `token_${user.id}_${Date.now()}`;

      console.log('✅ OTP verified successfully for:', mobile);

      res.json({
        success: true,
        message: 'OTP verified successfully',
        user,
        token
      });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }

  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products routes
app.get('/api/products', (req, res) => {
  try {
    console.log('📦 Products request received');
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/featured', (req, res) => {
  try {
    const featuredProducts = products.filter(p => p.featured).slice(0, 6);
    res.json({
      success: true,
      products: featuredProducts
    });
  } catch (error) {
    console.error('❌ Get featured products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders routes
app.get('/api/orders', (req, res) => {
  try {
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;

    const newOrder = {
      id: orders.length + 1,
      userId: 1, // For demo
      items,
      totalAmount,
      deliveryAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);

    console.log('✅ Order created successfully:', newOrder.id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users/profile', (req, res) => {
  try {
    const user = users[0]; // For demo, return first user
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userProfile } = user;
    res.json({
      success: true,
      user: userProfile
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Dairy Products Backend Server Started!');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
  console.log(`📊 Data loaded: ${users.length} users, ${products.length} products, ${orders.length} orders`);
  console.log('✅ Ready to accept requests!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
}); 