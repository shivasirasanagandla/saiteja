import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, CheckCircle, Clock, AlertCircle, 
  Search, Filter, RefreshCw, Navigation
} from 'lucide-react';
import OrderTracking from './OrderTracking';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 70px);
  overflow-y: auto;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: calc(100vh - 60px);
    margin-top: 15px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  
  @media (max-width: 768px) {
    padding-top: 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #64748b;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 250px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    border-color: #f59e0b;
    background: #fef3c7;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.9rem;

  ${props => props.variant === 'primary' ? `
    background: #f59e0b;
    color: white;
    
    &:hover {
      background: #d97706;
      transform: translateY(-1px);
    }
  ` : `
    background: white;
    color: #374151;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
  `}
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const OrderCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const OrderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrderNumber = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const OrderDate = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: ${props => {
    switch (props.status) {
      case 'delivered': return '#d1fae5';
      case 'in-transit': return '#dbeafe';
      case 'processing': return '#fef3c7';
      case 'cancelled': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'delivered': return '#059669';
      case 'in-transit': return '#2563eb';
      case 'processing': return '#d97706';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  }};
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #1e293b;
  font-weight: 600;
`;

const ItemsList = styled.div`
  margin-bottom: 1rem;
`;

const ItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 0.5rem;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ItemIcon = styled.span`
  font-size: 1.5rem;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.span`
  font-weight: 600;
  color: #1e293b;
`;

const ItemMeta = styled.span`
  font-size: 0.8rem;
  color: #64748b;
`;

const ItemPrice = styled.span`
  font-weight: 600;
  color: #1e293b;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Types
interface Order {
  id: string;
  orderNumber: string;
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
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
  deliveryAddress: string;
  deliveryDate: Date;
  trackingNumber: string;
  createdAt: Date;
}

interface MyOrdersProps {
  user: { type: 'email'|'mobile', value: string };
  location: string;
  orders?: Order[];
}

const MyOrders: React.FC<MyOrdersProps> = ({ user, location, orders: propOrders = [] }) => {
  // State management
  const [orders, setOrders] = useState<Order[]>(propOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ND-2024-001',
      status: 'delivered',
      items: [
        { id: 1, name: 'Fresh Milk', icon: '🥛', quantity: 2, price: 135, unit: 'litre' },
        { id: 2, name: 'Organic Ghee', icon: '🧈', quantity: 1, price: 3000, unit: 'litre' }
      ],
      total: 3270,
      deliveryAddress: '123 Main Street, Gurgaon, Haryana 122001',
      deliveryDate: new Date('2024-01-16'),
      trackingNumber: 'TRK-2024-001',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      orderNumber: 'ND-2024-002',
      status: 'in-transit',
      items: [
        { id: 3, name: 'Cheese', icon: '🧀', quantity: 3, price: 200, unit: 'kg' },
        { id: 1, name: 'Fresh Milk', icon: '🥛', quantity: 1, price: 135, unit: 'litre' }
      ],
      total: 735,
      deliveryAddress: '456 Park Avenue, Delhi, Delhi 110001',
      deliveryDate: new Date('2024-01-21'),
      trackingNumber: 'TRK-2024-002',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '3',
      orderNumber: 'ND-2024-003',
      status: 'processing',
      items: [
        { id: 2, name: 'Organic Ghee', icon: '🧈', quantity: 2, price: 3000, unit: 'litre' }
      ],
      total: 6000,
      deliveryAddress: '789 Lake Road, Mumbai, Maharashtra 400001',
      deliveryDate: new Date('2024-01-26'),
      trackingNumber: 'TRK-2024-003',
      createdAt: new Date('2024-01-25')
    }
  ];

  // Load orders
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize orders
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  const handleCloseTracking = () => {
    setShowTrackingModal(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} />;
      case 'in-transit': return <Truck size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'in-transit': return 'In Transit';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>My Orders</Title>
          <Subtitle>Track your dairy product orders and deliveries</Subtitle>
        </div>
        <Controls>
          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <FilterButton onClick={() => setStatusFilter('all')}>
            <Filter size={16} />
            {statusFilter === 'all' ? 'All Orders' : 'Filter'}
          </FilterButton>
          <ActionButton onClick={loadOrders}>
            <RefreshCw size={16} />
            Refresh
          </ActionButton>
        </Controls>
      </Header>



      {filteredOrders.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📦</EmptyIcon>
          <h3>No orders found</h3>
          <p>Start shopping to see your orders here</p>
        </EmptyState>
      ) : (
        <OrdersGrid>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OrderHeader>
                <OrderInfo>
                  <OrderNumber>{order.orderNumber}</OrderNumber>
                  <OrderDate>Ordered on {formatDate(order.createdAt)}</OrderDate>
                </OrderInfo>
                <StatusBadge status={order.status}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </StatusBadge>
              </OrderHeader>

              <OrderDetails>
                <DetailItem>
                  <DetailLabel>Delivery Address</DetailLabel>
                  <DetailValue>{order.deliveryAddress}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Expected Delivery</DetailLabel>
                  <DetailValue>{formatDate(order.deliveryDate)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Tracking Number</DetailLabel>
                  <DetailValue>{order.trackingNumber}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Total Amount</DetailLabel>
                  <DetailValue>{formatCurrency(order.total)}</DetailValue>
                </DetailItem>
              </OrderDetails>

              <ItemsList>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Order Items</h4>
                {order.items.map((item) => (
                  <ItemCard key={item.id}>
                    <ItemInfo>
                      <ItemIcon>{item.icon}</ItemIcon>
                      <ItemDetails>
                        <ItemName>{item.name}</ItemName>
                        <ItemMeta>Qty: {item.quantity} × {formatCurrency(item.price)} per {item.unit}</ItemMeta>
                      </ItemDetails>
                    </ItemInfo>
                    <ItemPrice>{formatCurrency(item.price * item.quantity)}</ItemPrice>
                  </ItemCard>
                ))}
              </ItemsList>

              <ActionButtons>
                <ActionButton onClick={() => handleTrackOrder(order)}>
                  <Navigation size={16} />
                  Track Order
                </ActionButton>
              </ActionButtons>
            </OrderCard>
          ))}
        </OrdersGrid>
      )}

      {/* Order Tracking Modal */}
      <AnimatePresence>
        {showTrackingModal && selectedOrder && (
          <OrderTracking
            order={selectedOrder}
            onClose={handleCloseTracking}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default MyOrders; 