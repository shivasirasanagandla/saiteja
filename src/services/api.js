import io from 'socket.io-client';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Socket.IO instance
let socket = null;

// Initialize socket connection
export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: {
      token
    },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

// Get socket instance
export const getSocket = () => socket;

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Authentication APIs
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    this.removeToken();
    return { success: true, message: 'Logged out successfully' };
  }

  // User Profile APIs
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Product APIs
  async getAllProducts() {
    return this.request('/products');
  }

  async getFeaturedProducts() {
    return this.request('/products/featured');
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  // Category APIs
  async getAllCategories() {
    return this.request('/categories');
  }

  async getProductsByCategory(categoryId) {
    return this.request(`/categories/${categoryId}/products`);
  }

  // Order APIs
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders() {
    return this.request('/orders');
  }

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Cart Management (Local Storage)
  getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  }

  removeFromCart(productId) {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  }

  updateCartItemQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
      }
    }

    return cart;
  }

  clearCart() {
    localStorage.removeItem('cart');
    return [];
  }

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Real-time updates (using polling for now)
  startRealtimeUpdates(callback, interval = 5000) {
    const poll = async () => {
      try {
        const data = await this.getAllProducts();
        callback(data);
      } catch (error) {
        console.error('Real-time update error:', error);
      }
    };

    // Initial call
    poll();

    // Set up polling
    const intervalId = setInterval(poll, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }

  // Error handling
  handleError(error) {
    console.error('API Error:', error);
    
    if (error.message.includes('401') || error.message.includes('403')) {
      this.removeToken();
      window.location.href = '/login';
    }

    return {
      success: false,
      error: error.message || 'An error occurred',
    };
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 