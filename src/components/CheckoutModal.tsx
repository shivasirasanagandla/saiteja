import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, ArrowRight, Milk, 
  CreditCard, QrCode, Building, User, Phone, Mail, Home, Package, Lock
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ModalScrollManager from './ModalScrollManager';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  max-width: 1200px;
  width: 100%;
  max-height: 95vh;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  z-index: 10;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  min-height: 700px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const RightPanel = styled.div`
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  overflow-y: auto;
  max-height: 95vh;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const BrandLogo = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const BrandTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
`;

const BrandSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.5;
  position: relative;
  z-index: 2;
`;

const CheckoutTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const CheckoutSubtitle = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const PaymentOptions = styled.div`
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PaymentOption = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? '#f59e0b' : '#e2e8f0'};
  background: ${props => props.selected ? '#fef3c7' : 'white'};
  transition: all 0.2s ease;

  &:hover {
    border-color: #f59e0b;
    background: ${props => props.selected ? '#fef3c7' : '#f8fafc'};
  }
`;

const PaymentDetails = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const QRCodeContainer = styled.div`
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const QRCode = styled.div`
  width: 200px;
  height: 200px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const CardForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const PrimaryButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1rem;

  &:hover {
    background: #d97706;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const OrderSummary = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const TotalSection = styled.div`
  border-top: 2px solid #e2e8f0;
  padding-top: 1rem;
  margin-top: 1rem;
`;

interface CheckoutModalProps {
  cart: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    features?: string[];
    badge?: string;
    icon?: string;
    unit?: string;
  }>;
  onClose: () => void;
  onOrderComplete: (orderData: Omit<{
    id: string;
    orderNumber: string;
    status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
    trackingNumber: string;
    deliveryAddress: string;
    deliveryDate: Date;
    items: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
      description?: string;
      features?: string[];
      badge?: string;
      icon?: string;
      unit?: string;
    }>;
    total: number;
    createdAt: Date;
  }, 'id' | 'orderNumber' | 'trackingNumber' | 'createdAt'>) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ cart, onClose, onOrderComplete }) => {
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Address form state
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    
    setIsLoading(true);
    // Simulate order processing
    setTimeout(() => {
      const deliveryAddress = `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;
      const deliveryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
      
      onOrderComplete({
        status: 'processing',
        deliveryAddress,
        deliveryDate,
        items: cart,
        total: totalAmount
      });
      setIsLoading(false);
    }, 2000);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50;

  return (
    <>
      <ModalScrollManager isOpen={true} />
      <AnimatePresence>
        <ModalOverlay onClick={onClose}>
          <ModalContainer
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <CheckoutContent>
          <LeftPanel>
            <BrandLogo>
              <Milk size={24} color="white" />
            </BrandLogo>
            <BrandTitle>Nature's Dairy</BrandTitle>
            <BrandSubtitle>
              Fresh, organic dairy products delivered to your doorstep
            </BrandSubtitle>
          </LeftPanel>
          
          <RightPanel>
            <CheckoutTitle>Checkout</CheckoutTitle>
            <CheckoutSubtitle>
              {step === 'address' ? 'Enter your delivery address' : 'Choose your payment method'}
            </CheckoutSubtitle>

            {step === 'address' ? (
              <Form onSubmit={handleAddressSubmit}>
                <Section>
                  <SectionTitle>
                    <User size={16} />
                    Personal Information
                  </SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <InputGroup>
                      <Label>
                        <User size={16} />
                        Full Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={address.fullName}
                        onChange={(e) => setAddress({...address, fullName: e.target.value})}
                        required
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>
                        <Phone size={16} />
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        required
                      />
                    </InputGroup>
                  </div>
                  <InputGroup>
                    <Label>
                      <Mail size={16} />
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={address.email}
                      onChange={(e) => setAddress({...address, email: e.target.value})}
                      required
                    />
                  </InputGroup>
                </Section>

                <Section>
                  <SectionTitle>
                    <Home size={16} />
                    Delivery Address
                  </SectionTitle>
                  <InputGroup>
                    <Label>
                      <MapPin size={16} />
                      Street Address
                    </Label>
                    <TextArea
                      placeholder="Enter your complete street address"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      required
                    />
                  </InputGroup>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <InputGroup>
                      <Label>City</Label>
                      <Input
                        type="text"
                        placeholder="Enter your city"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        required
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>State</Label>
                      <Input
                        type="text"
                        placeholder="Enter your state"
                        value={address.state}
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                        required
                      />
                    </InputGroup>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <InputGroup>
                      <Label>Pincode</Label>
                      <Input
                        type="text"
                        placeholder="Enter pincode"
                        value={address.pincode}
                        onChange={(e) => setAddress({...address, pincode: e.target.value})}
                        required
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Landmark (Optional)</Label>
                      <Input
                        type="text"
                        placeholder="Near hospital, school, etc."
                        value={address.landmark}
                        onChange={(e) => setAddress({...address, landmark: e.target.value})}
                      />
                    </InputGroup>
                  </div>
                </Section>

                <PrimaryButton type="submit">
                  Continue to Payment
                  <ArrowRight size={16} />
                </PrimaryButton>
              </Form>
            ) : (
              <Form onSubmit={handlePaymentSubmit}>
                <Section>
                  <SectionTitle>
                    <Package size={16} />
                    Order Summary
                  </SectionTitle>
                  <OrderSummary>
                    {cart.map((item) => (
                      <OrderItem key={item.id}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1e293b' }}>
                            {item.name} × {item.quantity}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            ₹{item.price} per {item.unit || 'unit'}
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>
                          ₹{item.price * item.quantity}
                        </div>
                      </OrderItem>
                    ))}
                    <TotalSection>
                      <OrderItem>
                        <span>Subtotal:</span>
                        <span>₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                      </OrderItem>
                      <OrderItem>
                        <span>Delivery:</span>
                        <span>₹50</span>
                      </OrderItem>
                      <OrderItem style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                        <span>Total:</span>
                        <span>₹{totalAmount}</span>
                      </OrderItem>
                    </TotalSection>
                  </OrderSummary>
                </Section>

                <Section>
                  <SectionTitle>
                    <CreditCard size={16} />
                    Payment Method
                  </SectionTitle>
                  <PaymentOptions>
                    <PaymentOption selected={selectedPayment === 'cod'}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={selectedPayment === 'cod'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>💵 Cash on Delivery</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pay when you receive your order</div>
                      </div>
                    </PaymentOption>

                    <PaymentOption selected={selectedPayment === 'upi'}>
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={selectedPayment === 'upi'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>📱 UPI Payment</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Scan QR code to pay instantly</div>
                      </div>
                    </PaymentOption>

                    <PaymentOption selected={selectedPayment === 'card'}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={selectedPayment === 'card'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>💳 Credit/Debit Card</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Secure card payment</div>
                      </div>
                    </PaymentOption>

                    <PaymentOption selected={selectedPayment === 'netbanking'}>
                      <input
                        type="radio"
                        name="payment"
                        value="netbanking"
                        checked={selectedPayment === 'netbanking'}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>🏦 Net Banking</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pay through your bank account</div>
                      </div>
                    </PaymentOption>
                  </PaymentOptions>

                  <PaymentDetails show={selectedPayment === 'upi'}>
                    <QRCodeContainer>
                      <QRCode>
                        <QrCode size={80} color="#374151" />
                      </QRCode>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#1e293b' }}>
                        Scan QR Code to Pay
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                        UPI ID: naturesdairy@upi
                      </p>
                    </QRCodeContainer>
                  </PaymentDetails>

                  <PaymentDetails show={selectedPayment === 'card'}>
                    <CardForm>
                      <InputGroup>
                        <Label>
                          <CreditCard size={16} />
                          Card Number
                        </Label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </InputGroup>
                      <InputGroup>
                        <Label>
                          <User size={16} />
                          Cardholder Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="John Doe"
                        />
                      </InputGroup>
                      <InputGroup>
                        <Label>Expiry Date</Label>
                        <Input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </InputGroup>
                      <InputGroup>
                        <Label>
                          <Lock size={16} />
                          CVV
                        </Label>
                        <Input
                          type="password"
                          placeholder="123"
                          maxLength={4}
                        />
                      </InputGroup>
                    </CardForm>
                  </PaymentDetails>

                  <PaymentDetails show={selectedPayment === 'netbanking'}>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      <Building size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#1e293b' }}>
                        Select Your Bank
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                        You will be redirected to your bank's secure payment gateway
                      </p>
                    </div>
                  </PaymentDetails>
                </Section>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    style={{
                      background: 'white',
                      color: '#374151',
                      border: '2px solid #e2e8f0',
                      padding: '1rem 1.5rem',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flex: 1
                    }}
                  >
                    Back to Address
                  </button>
                  <PrimaryButton type="submit" disabled={!selectedPayment || isLoading}>
                     {isLoading ? (
                       <LoadingSpinner text="Processing..." size="small" />
                     ) : (
                       `Pay ₹${totalAmount}`
                     )}
                  </PrimaryButton>
                </div>
              </Form>
            )}
          </RightPanel>
        </CheckoutContent>
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
    </>
  );
};

export default CheckoutModal; 