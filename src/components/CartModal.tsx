import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  X, ShoppingCart, Plus, Minus, Trash2, 
  CreditCard, Truck
} from 'lucide-react';
import ModalWrapper from './ModalWrapper';

const Header = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyCartText = styled.p`
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

const ItemPrice = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
`;

const ItemUnit = styled.span`
  color: #f59e0b;
  font-weight: 500;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #1e293b;
`;

const RemoveButton = styled.button`
  background: #fee2e2;
  border: none;
  color: #dc2626;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fecaca;
  }
`;

const Footer = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const SummaryLabel = styled.span`
  font-weight: 600;
  color: #64748b;
`;

const SummaryValue = styled.span`
  font-weight: 700;
  color: #1e293b;
  font-size: 1.1rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeliveryInfo = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #92400e;
`;

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

interface CartModalProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  user: { type: 'email' | 'mobile'; value: string } | null;
}

const CartModal: React.FC<CartModalProps> = ({
  cart, 
  setCart, 
  isOpen, 
  onClose, 
  onCheckout,
  user 
}) => {
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = totalAmount > 0 ? 50 : 0;
  const finalTotal = totalAmount + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      onClose();
      return;
    }
    onCheckout();
  };

    return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <Header>
              <HeaderTitle>
                <ShoppingCart size={24} />
                Shopping Cart ({cart.length} items)
              </HeaderTitle>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </Header>

            <Content>
              {cart.length === 0 ? (
                <EmptyCart>
                  <EmptyCartIcon>🛒</EmptyCartIcon>
                  <EmptyCartText>Your cart is empty</EmptyCartText>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>
                    Add some fresh dairy products to get started!
                  </p>
                </EmptyCart>
              ) : (
                <>
                  {cart.map((item) => (
                    <CartItem key={item.id}>
                      <ItemImage>
                        {item.icon || '🥛'}
                      </ItemImage>
                      <ItemDetails>
                        <ItemName>{item.name}</ItemName>
                        <ItemPrice>
                          ₹{item.price} per <ItemUnit>{item.unit}</ItemUnit>
                        </ItemPrice>
                      </ItemDetails>
                      <QuantityControls>
                        <QuantityButton
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </QuantityButton>
                        <QuantityDisplay>{item.quantity}</QuantityDisplay>
                        <QuantityButton
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </QuantityButton>
                      </QuantityControls>
                      <RemoveButton onClick={() => removeItem(item.id)}>
                        <Trash2 size={16} />
                      </RemoveButton>
                    </CartItem>
                  ))}
                </>
              )}
            </Content>

            {cart.length > 0 && (
              <Footer>
                <DeliveryInfo>
                  <Truck size={16} />
                  Free delivery on orders above ₹200
                </DeliveryInfo>
                
                <Summary>
                  <SummaryLabel>Subtotal</SummaryLabel>
                  <SummaryValue>₹{totalAmount.toFixed(2)}</SummaryValue>
                </Summary>
                
                <Summary>
                  <SummaryLabel>Delivery Fee</SummaryLabel>
                  <SummaryValue>₹{deliveryFee.toFixed(2)}</SummaryValue>
                </Summary>
                
                <Summary>
                  <SummaryLabel>Total</SummaryLabel>
                  <SummaryValue>₹{finalTotal.toFixed(2)}</SummaryValue>
                </Summary>

                <CheckoutButton onClick={handleCheckout}>
                  <CreditCard size={20} />
                  Proceed to Checkout
                </CheckoutButton>
                            </Footer>
            )}
          </ModalWrapper>
        );
      };

      export default CartModal; 