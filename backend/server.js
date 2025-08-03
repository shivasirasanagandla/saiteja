const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, onSnapshot } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } = require('firebase/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Authentication Middleware
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

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile
    await updateProfile(user, {
      displayName: name
    });

    // Save additional user data to Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      name: name,
      phone: phone || '',
      address: address || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await addDoc(collection(db, 'users'), userData);

    // Generate JWT token
    const token = jwt.sign(
      { uid: user.uid, email: user.email, name: name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        uid: user.uid,
        email: user.email,
        name: name
      },
      token: token
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already registered';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format';
    }

    res.status(400).json({
      success: false,
      error: errorMessage
    });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    let userData = null;
    if (!querySnapshot.empty) {
      userData = querySnapshot.docs[0].data();
    }

    // Generate JWT token
    const token = jwt.sign(
      { uid: user.uid, email: user.email, name: userData?.name || user.displayName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email,
        name: userData?.name || user.displayName,
        phone: userData?.phone || '',
        address: userData?.address || ''
      },
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Login failed';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid password';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format';
    }

    res.status(401).json({
      success: false,
      error: errorMessage
    });
  }
});

// Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', req.user.uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = querySnapshot.docs[0].data();
    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update User Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', req.user.uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const docRef = doc(db, 'users', querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      name: name || req.user.name,
      phone: phone || '',
      address: address || '',
      updatedAt: serverTimestamp()
    });

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get All Products
app.get('/api/products', async (req, res) => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get Featured Products
app.get('/api/products/featured', async (req, res) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('featured', '==', true), limit(6));
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to get featured products' });
  }
});

// Get Product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = {
      id: docSnap.id,
      ...docSnap.data()
    };

    res.json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// Create Order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, deliveryAddress, total, paymentMethod } = req.body;

    if (!items || !deliveryAddress || !total) {
      return res.status(400).json({ error: 'Items, delivery address, and total are required' });
    }

    const orderData = {
      userId: req.user.uid,
      items: items,
      deliveryAddress: deliveryAddress,
      total: total,
      paymentMethod: paymentMethod || 'cash',
      status: 'processing',
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trackingNumber: `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: docRef.id,
      order: {
        id: docRef.id,
        ...orderData
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get User Orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', req.user.uid), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get Order by ID
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = docSnap.data();
    
    // Check if user owns this order
    if (order.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      order: {
        id: docSnap.id,
        ...order
      }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Update Order Status (Admin only)
app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp()
    });

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categoriesRef = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      categories: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Get Products by Category
app.get('/api/categories/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('categoryId', '==', id));
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({ error: 'Failed to get category products' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app; 