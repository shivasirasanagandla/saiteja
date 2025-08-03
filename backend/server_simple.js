const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data storage (in-memory for simplicity)
let users = [];
let products = [];
let orders = [];

// Load initial data
const loadInitialData = async () => {
  try {
    // Load users
    const usersData = await fs.readFile(path.join(__dirname, 'data', 'users.json'), 'utf8');
    users = JSON.parse(usersData);
    
    // Load products
    const productsData = await fs.readFile(path.join(__dirname, 'data', 'products.json'), 'utf8');
    products = JSON.parse(productsData);
    
    // Load orders
    const ordersData = await fs.readFile(path.join(__dirname, 'data', 'orders.json'), 'utf8');
    orders = JSON.parse(ordersData);
    
    console.log('Initial data loaded successfully');
  } catch (error) {
    console.log('No existing data found, starting with empty arrays');
  }
};

// Save data to files
const saveData = async () => {
  try {
    await fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2));
    await fs.writeFile(path.join(__dirname, 'data', 'products.json'), JSON.stringify(products, null, 2));
    await fs.writeFile(path.join(__dirname, 'data', 'orders.json'), JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      mobile: mobile || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    await saveData();

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
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
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    // Generate OTP (in real app, send via SMS)
    const otp = Math.floor(100000 + Math.random() * 900000);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp.toString() // In production, don't send OTP in response
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ error: 'Mobile and OTP are required' });
    }

    // In real app, verify OTP from database/cache
    // For demo, accept any 6-digit OTP
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
        await saveData();
      }

      const token = jwt.sign(
        { userId: user.id, mobile: user.mobile },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

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
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products routes
app.get('/api/products', (req, res) => {
  try {
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Get products error:', error);
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
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders routes
app.get('/api/orders', authenticateToken, (req, res) => {
  try {
    const userOrders = orders.filter(order => order.userId === req.user.userId);
    res.json({
      success: true,
      orders: userOrders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;

    const newOrder = {
      id: orders.length + 1,
      userId: req.user.userId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    await saveData();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/users/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userProfile } = user;
    res.json({
      success: true,
      user: userProfile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize data and start server
const PORT = process.env.PORT || 5000;

loadInitialData().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/api`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = { app, server, io }; 