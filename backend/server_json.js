const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Helper function to read JSON files
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
};

// Helper function to write JSON files
const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error.message);
    return false;
  }
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check if data files exist
    const products = await readJsonFile(PRODUCTS_FILE);
    const categories = await readJsonFile(CATEGORIES_FILE);
    const orders = await readJsonFile(ORDERS_FILE);
    
    res.json({ 
      status: 'healthy', 
      message: 'Server and data files are accessible',
      data: {
        products_count: products.length,
        categories_count: categories.length,
        orders_count: orders.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error.message);
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message 
    });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await readJsonFile(PRODUCTS_FILE);
    const activeProducts = products.filter(product => product.is_active);
    res.json(activeProducts);
  } catch (error) {
    console.error('Products API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await readJsonFile(PRODUCTS_FILE);
    const product = products.find(p => p.product_id == req.params.id && p.is_active);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Product API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await readJsonFile(PRODUCTS_FILE);
    const featuredProducts = products.filter(product => product.is_featured && product.is_active);
    res.json(featuredProducts);
  } catch (error) {
    console.error('Featured products API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get product categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await readJsonFile(CATEGORIES_FILE);
    const activeCategories = categories.filter(category => category.is_active);
    res.json(activeCategories);
  } catch (error) {
    console.error('Categories API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
app.get('/api/categories/:id/products', async (req, res) => {
  try {
    const products = await readJsonFile(PRODUCTS_FILE);
    const categoryProducts = products.filter(product => 
      product.category_id == req.params.id && product.is_active
    );
    res.json(categoryProducts);
  } catch (error) {
    console.error('Category products API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { first_name, last_name, email, mobile, password } = req.body;
    const users = await readJsonFile(USERS_FILE);
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email || user.mobile === mobile);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      user_id: users.length + 1,
      email,
      mobile,
      password_hash: password, // In production, hash the password
      first_name,
      last_name,
      is_verified: false,
      is_active: true,
      created_at: new Date().toISOString(),
      last_login: null
    };
    
    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);
    
    res.json({ 
      success: true, 
      message: 'User registered successfully',
      user_id: newUser.user_id 
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJsonFile(USERS_FILE);
    
    const user = users.find(u => 
      (u.email === email || u.mobile === email) && 
      u.password_hash === password && 
      u.is_active
    );
    
    if (user) {
      // Update last login
      user.last_login = new Date().toISOString();
      await writeJsonFile(USERS_FILE, users);
      
      res.json({ 
        success: true, 
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          mobile: user.mobile
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await readJsonFile(USERS_FILE);
    const safeUsers = users.map(user => ({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      mobile: user.mobile,
      is_verified: user.is_verified,
      created_at: user.created_at
    }));
    res.json(safeUsers);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { user_id, delivery_address_id, payment_method, items, total_amount, special_instructions } = req.body;
    const orders = await readJsonFile(ORDERS_FILE);
    
    // Generate order number with timestamp
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const orderNumber = `ORD-${timestamp}-${randomNum}`;
    
    // Create new order
    const newOrder = {
      order_id: orders.length + 1,
      order_number: orderNumber,
      user_id: parseInt(user_id),
      delivery_address_id: parseInt(delivery_address_id),
      order_status: 'pending',
      payment_status: 'pending',
      payment_method,
      subtotal: parseFloat(total_amount),
      tax_amount: 0,
      delivery_fee: 30,
      discount_amount: 0,
      total_amount: parseFloat(total_amount) + 30,
      currency: 'INR',
      delivery_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      delivery_time_slot: '09:00-11:00',
      special_instructions: special_instructions || '',
      items: items || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    orders.push(newOrder);
    await writeJsonFile(ORDERS_FILE, orders);
    
    console.log(`New order created: ${orderNumber} for user ${user_id}`);
    
    res.json({ 
      success: true, 
      message: 'Order created successfully',
      order_id: newOrder.order_id,
      order_number: newOrder.order_number,
      order: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
app.get('/api/users/:userId/orders', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await readJsonFile(ORDERS_FILE);
    const userOrders = orders.filter(order => order.user_id == userId);
    
    // Sort by creation date (newest first)
    userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(userOrders);
  } catch (error) {
    console.error('Get user orders error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (for admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readJsonFile(ORDERS_FILE);
    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;
    const orders = await readJsonFile(ORDERS_FILE);
    
    const orderIndex = orders.findIndex(order => order.order_id == orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    orders[orderIndex].order_status = order_status;
    orders[orderIndex].updated_at = new Date().toISOString();
    
    await writeJsonFile(ORDERS_FILE, orders);
    
    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Update order status error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search products
app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    const products = await readJsonFile(PRODUCTS_FILE);
    
    if (!q) {
      return res.json(products.filter(p => p.is_active));
    }
    
    const searchResults = products.filter(product => 
      product.is_active && 
      (product.product_name.toLowerCase().includes(q.toLowerCase()) ||
       product.product_description.toLowerCase().includes(q.toLowerCase()))
    );
    
    res.json(searchResults);
  } catch (error) {
    console.error('Search products error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Process error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  console.error('Stack trace:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 JSON Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`\n✅ Server is ready to accept requests!`);
  console.log(`📁 Using JSON files as data store`);
  console.log(`🔄 Order history cleared - ready for fresh orders!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app; 