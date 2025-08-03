import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';
import LandingHeader from './LandingHeader';
import Hero from './Hero';
import About from './About';
import Products from './Products';
import Practices from './Practices';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Footer from './Footer';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import LocationModal from './LocationModal';
import Chatbot from './Chatbot';
import MyOrders from './MyOrders';
import AIEnhancedChatbot from './AIEnhancedChatbot';
import CheckoutModal from './CheckoutModal';
import CartModal from './CartModal';
import ToastNotification from './ToastNotification';
import QualityAssurance from './QualityAssurance';

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

interface AppContentProps {
  user: User | null;
  location: string;
  cart: CartItem[];
  orders: Order[];
  showLoginModal: boolean;
  showRegisterModal: boolean;
  showLocationModal: boolean;
  showCart: boolean;
  showCheckout: boolean;
  isChatbotOpen: boolean;
  aiFeaturesEnabled: boolean;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    title?: string;
  };
  onLogout: () => void;
  onLogin: (userData: User) => void;
  onRegister: (data: { type: 'register' }) => void;
  onRegisterComplete: (userData: any) => void;
  onLocationSelect: (selectedLocation: string) => void;
  onCartClick: () => void;
  onPurchaseAttempt: () => void;
  onCheckout: () => void;
  onOrderComplete: (orderData: Omit<Order, 'id' | 'orderNumber' | 'trackingNumber' | 'createdAt'>) => void;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRegisterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLocationModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCheckout: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChatbotOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartCount: number;
  onToastClose: () => void;
}

const AppContent: React.FC<AppContentProps> = ({
  user,
  location,
  cart,
  orders,
  showLoginModal,
  showRegisterModal,
  showLocationModal,
  showCart,
  showCheckout,
  isChatbotOpen,
  aiFeaturesEnabled,
  toast,
  onLogout,
  onLogin,
  onRegister,
  onRegisterComplete,
  onLocationSelect,
  onCartClick,
  onPurchaseAttempt,
  onCheckout,
  onOrderComplete,
  setShowLoginModal,
  setShowRegisterModal,
  setShowLocationModal,
  setShowCart,
  setShowCheckout,
  setIsChatbotOpen,
  setCart,
  cartCount,
  onToastClose
}) => {
  // Scroll to top on route changes
  useScrollToTop();

  return (
    <div className="App">
      <LandingHeader 
        user={user} 
        onLogout={onLogout} 
        cartCount={cartCount}
        onCartClick={onCartClick}
        onLogin={() => setShowLoginModal(true)}
      />
      <div style={{ 
        backgroundColor: 'transparent',
        minHeight: '100vh'
      }}>
        <Routes>
          <Route path="/" element={<Hero cart={cart} setCart={setCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={
            <Products 
              cart={cart} 
              setCart={setCart} 
              showCart={showCart} 
              setShowCart={setShowCart}
              onPurchaseAttempt={onPurchaseAttempt}
              onCheckout={onCheckout}
              user={user}
            />
          } />
          <Route path="/practices" element={<Practices />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={
            user ? <MyOrders user={user} location={location} orders={orders} /> : <Navigate to="/" />
          } />
          <Route path="/quality" element={<QualityAssurance />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
      
      {/* Chatbot */}
      {aiFeaturesEnabled ? (
        <AIEnhancedChatbot 
          isOpen={isChatbotOpen} 
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
          user={user}
        />
      ) : (
        <Chatbot 
          isOpen={isChatbotOpen} 
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onLogin={onLogin} 
          onRegister={onRegister}
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal 
          onRegister={onRegisterComplete}
          onClose={() => setShowRegisterModal(false)}
          onBackToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {/* Location Selection Modal */}
      {showLocationModal && user && (
        <LocationModal 
          user={user} 
          onLocationSelect={onLocationSelect} 
          onSkip={() => {
            onLocationSelect('Default');
            setShowLocationModal(false);
          }}
          onClose={() => setShowLocationModal(false)}
        />
      )}

      {/* Cart Modal */}
      <CartModal
        cart={cart}
        setCart={setCart}
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={onCheckout}
        user={user}
      />

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onOrderComplete={onOrderComplete}
        />
      )}

      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={onToastClose}
        title={toast.title}
      />
    </div>
  );
};

export default AppContent; 