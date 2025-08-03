import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AppContent from './components/AppContent';
import { AuthProvider } from './contexts/AuthContext';

// Types
interface User {
  type: 'email' | 'mobile';
  value: string;
  name?: string;
  id?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  features?: string[];
  badge?: string;
  icon?: string;
  unit?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
  trackingNumber: string;
  deliveryAddress: string;
  deliveryDate: Date;
  items: CartItem[];
  total: number;
  createdAt: Date;
}

function App() {
  // Prevent unwanted cursor behavior
  useEffect(() => {
    const preventCursorBehavior = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && !target.matches('input, textarea, button, a, [contenteditable="true"]')) {
        target.style.cursor = 'default';
        target.setAttribute('tabindex', '-1');
      }
    };

    // Add event listeners to prevent cursor behavior
    document.addEventListener('click', preventCursorBehavior);
    document.addEventListener('mousedown', preventCursorBehavior);
    document.addEventListener('mouseup', preventCursorBehavior);

    return () => {
      document.removeEventListener('click', preventCursorBehavior);
      document.removeEventListener('mousedown', preventCursorBehavior);
      document.removeEventListener('mouseup', preventCursorBehavior);
    };
  }, []);



  // State management with localStorage persistence
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('naturesdairy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [location, setLocation] = useState<string>(() => {
    return localStorage.getItem('naturesdairy_location') || '';
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('naturesdairy_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('naturesdairy_orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Convert date strings back to Date objects
      return parsedOrders.map((order: any) => ({
        ...order,
        deliveryDate: new Date(order.deliveryDate),
        createdAt: new Date(order.createdAt)
      }));
    }
    return [];
  });

  // UI State
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [aiFeaturesEnabled] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    title?: string;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('naturesdairy_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('naturesdairy_user');
    }
  }, [user]);

  // Persist location to localStorage
  useEffect(() => {
    if (location) {
      localStorage.setItem('naturesdairy_location', location);
    } else {
      localStorage.removeItem('naturesdairy_location');
    }
  }, [location]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('naturesdairy_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist orders to localStorage
  useEffect(() => {
    localStorage.setItem('naturesdairy_orders', JSON.stringify(orders));
  }, [orders]);

  const handleLogout = () => {
    setUser(null);
    setLocation('');
    setCart([]);
    setShowCart(false);
    setShowCheckout(false);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowLoginModal(false);
    // After login, show location selection
    setShowLocationModal(true);
  };

  const handleRegister = (data: { type: 'register' }) => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleRegisterComplete = (userData: any) => {
    // Convert registration data to User format
    const newUser: User = {
      type: 'email',
      value: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      id: userData.user_id
    };
    
    setUser(newUser);
    setShowRegisterModal(false);
    
    // Show success message
    setToast({
      message: 'Registration successful! Welcome to Nature\'s Dairy.',
      type: 'success',
      isVisible: true,
      title: 'Welcome!'
    });
    
    // After registration, show location selection
    setShowLocationModal(true);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowLocationModal(false);
  };

  const handleCartClick = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowCart(true);
  };

  const handlePurchaseAttempt = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!location) {
      setShowLocationModal(true);
      return;
    }
    // Proceed with purchase
    setShowCart(true);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderComplete = (orderData: Omit<Order, 'id' | 'orderNumber' | 'trackingNumber' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      trackingNumber: `TRK-${Date.now().toString().slice(-8)}`,
      createdAt: new Date()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setShowCheckout(false);
    
    // Show success message
    setToast({
      message: `Order placed successfully! Order Number: ${newOrder.orderNumber}`,
      type: 'success',
      isVisible: true,
      title: 'Order Confirmed'
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppContent
            user={user}
            location={location}
            cart={cart}
            orders={orders}
            showLoginModal={showLoginModal}
            showRegisterModal={showRegisterModal}
            showLocationModal={showLocationModal}
            showCart={showCart}
            showCheckout={showCheckout}
            isChatbotOpen={isChatbotOpen}
            aiFeaturesEnabled={aiFeaturesEnabled}
            toast={toast}
            onLogout={handleLogout}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onRegisterComplete={handleRegisterComplete}
            onLocationSelect={handleLocationSelect}
            onCartClick={handleCartClick}
            onPurchaseAttempt={handlePurchaseAttempt}
            onCheckout={handleCheckout}
            onOrderComplete={handleOrderComplete}
            setShowLoginModal={setShowLoginModal}
            setShowRegisterModal={setShowRegisterModal}
            setShowLocationModal={setShowLocationModal}
            setShowCart={setShowCart}
            setShowCheckout={setShowCheckout}
            setIsChatbotOpen={setIsChatbotOpen}
            setCart={setCart}
            cartCount={cartCount}
            onToastClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
          />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 