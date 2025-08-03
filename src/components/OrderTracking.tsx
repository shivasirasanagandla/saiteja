import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, CheckCircle, Clock, AlertCircle, MapPin, 
  X, RefreshCw, Navigation, Package,
  Share2, Printer, Download, Bell, BellOff
} from 'lucide-react';

const TrackingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #fef3c7 100%);
  z-index: 2000;
  overflow-y: auto;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`;

const TrackingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatusCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StatusInfo = styled.div`
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #64748b;
    margin: 0;
    font-size: 1rem;
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${props => {
    switch (props.status) {
      case 'delivered': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'in-transit': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'processing': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'cancelled': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 1.5rem 0;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
  transition: width 0.5s ease;
  width: ${props => props.progress}%;
`;

const TimelineContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const TimelineItem = styled.div<{ completed: boolean; active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  opacity: ${props => props.completed ? 1 : 0.6};
  transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 40px;
    bottom: -2rem;
    width: 2px;
    background: ${props => props.completed ? '#10b981' : '#e2e8f0'};
    z-index: 1;
  }

  &:last-child::before {
    display: none;
  }

  .timeline-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => {
      if (props.active) return 'linear-gradient(135deg, #f59e0b, #d97706)';
      if (props.completed) return 'linear-gradient(135deg, #10b981, #059669)';
      return '#f1f5f9';
    }};
    color: ${props => props.completed || props.active ? 'white' : '#64748b'};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 2;
    box-shadow: ${props => props.completed || props.active ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'};
  }

  .timeline-content {
    flex: 1;
    padding-top: 0.25rem;

    h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: #1e293b;
      font-weight: 600;
    }

    p {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #64748b;
    }

    .location {
      font-size: 0.85rem;
      color: #f59e0b;
      font-weight: 500;
    }
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #64748b;
    font-size: 0.9rem;
  }

  .value {
    color: #1e293b;
    font-weight: 600;
    font-size: 0.9rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  padding: 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: #f59e0b;
    color: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  }

  &.primary {
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;

    &:hover {
      background: #d97706;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
  }

  &.success {
    background: #10b981;
    color: white;
    border-color: #10b981;

    &:hover {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  }
`;

const MapContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #64748b;
  font-weight: 500;
`;

const NotificationCard = styled(motion.div)`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;

  h4 {
    margin: 0 0 0.5rem 0;
    color: #92400e;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #92400e;
    font-size: 0.9rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #1e293b;
    transform: translateY(-1px);
  }
`;

const Toast = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 3000;
  max-width: 300px;
`;

interface TrackingEvent {
  id: string;
  title: string;
  description: string;
  location?: string;
  timestamp: Date;
  completed: boolean;
  active: boolean;
  icon: React.ReactNode;
}

interface OrderTrackingProps {
  order: {
    id: string;
    orderNumber: string;
    status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
    trackingNumber: string;
    deliveryAddress: string;
    deliveryDate: Date;
    items: Array<{
      id: number;
      name: string;
      quantity: number;
      price: number;
      description?: string;
      features?: string[];
      badge?: string;
      icon?: string;
      unit?: string;
    }>;
    total: number;
    createdAt: Date;
  };
  onClose: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order, onClose }) => {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [estimatedDelivery] = useState<Date>(order.deliveryDate);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize tracking events based on order status
  useEffect(() => {
    const events: TrackingEvent[] = [
      {
        id: '1',
        title: 'Order Placed',
        description: 'Your order has been successfully placed',
        timestamp: new Date(order.deliveryDate.getTime() - 24 * 60 * 60 * 1000),
        completed: true,
        active: false,
        icon: <CheckCircle size={16} />
      },
      {
        id: '2',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        timestamp: new Date(order.deliveryDate.getTime() - 23 * 60 * 60 * 1000),
        completed: order.status !== 'processing',
        active: order.status === 'processing',
        icon: <Package size={16} />
      },
      {
        id: '3',
        title: 'Out for Delivery',
        description: 'Your order is on its way to you',
        location: 'Gurgaon Distribution Center',
        timestamp: new Date(order.deliveryDate.getTime() - 2 * 60 * 60 * 1000),
        completed: order.status === 'delivered',
        active: order.status === 'in-transit',
        icon: <Truck size={16} />
      },
      {
        id: '4',
        title: 'Delivered',
        description: 'Your order has been delivered successfully',
        location: order.deliveryAddress,
        timestamp: order.deliveryDate,
        completed: order.status === 'delivered',
        active: false,
        icon: <CheckCircle size={16} />
      }
    ];

    setTrackingEvents(events);
  }, [order]);

  // Auto-refresh tracking every 30 seconds
  useEffect(() => {
    if (order.status === 'in-transit') {
      refreshInterval.current = setInterval(() => {
        refreshTracking();
      }, 30000);
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [order.status]);

  // Simulate real-time location updates
  useEffect(() => {
    if (order.status === 'in-transit') {
      const locations = [
        'Gurgaon Distribution Center',
        'Delhi Highway',
        'Near Your Location',
        order.deliveryAddress
      ];

      let currentIndex = 0;
      const locationInterval = setInterval(() => {
        setCurrentLocation(locations[currentIndex]);
        currentIndex = (currentIndex + 1) % locations.length;
      }, 10000);

      return () => clearInterval(locationInterval);
    }
  }, [order.status, order.deliveryAddress]);

  const refreshTracking = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update tracking events with new timestamps
      setTrackingEvents(prev => prev.map(event => ({
        ...event,
        timestamp: new Date(event.timestamp.getTime() + Math.random() * 1000)
      })));

      showToastNotification('Tracking updated successfully', 'success');
    } catch (error) {
      showToastNotification('Failed to update tracking', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const showToastNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShareTracking = () => {
    const trackingUrl = `${window.location.origin}/track/${order.trackingNumber}`;
    navigator.clipboard.writeText(trackingUrl);
    showToastNotification('Tracking link copied to clipboard', 'success');
  };

  const handlePrintTracking = () => {
    window.print();
    showToastNotification('Print dialog opened', 'info');
  };

  const handleDownloadTracking = () => {
    const trackingData = {
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      estimatedDelivery: estimatedDelivery.toISOString(),
      events: trackingEvents
    };

    const blob = new Blob([JSON.stringify(trackingData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracking-${order.trackingNumber}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToastNotification('Tracking data downloaded', 'success');
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    showToastNotification(
      notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled',
      'info'
    );
  };

  const getProgressPercentage = () => {
    const completedEvents = trackingEvents.filter(event => event.completed).length;
    return (completedEvents / trackingEvents.length) * 100;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <TrackingContainer>
      <Container>
        <Header>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
          <Title>Track Your Order</Title>
          <Subtitle>
            Real-time tracking for order {order.orderNumber}
          </Subtitle>
        </Header>

        <TrackingGrid>
          <MainContent>
            {/* Status Card */}
            <StatusCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatusHeader>
                <StatusInfo>
                  <h2>Order Status</h2>
                  <p>Tracking Number: {order.trackingNumber}</p>
                </StatusInfo>
                <StatusBadge status={order.status}>
                  {order.status === 'delivered' && <CheckCircle size={16} />}
                  {order.status === 'in-transit' && <Truck size={16} />}
                  {order.status === 'processing' && <Clock size={16} />}
                  {order.status === 'cancelled' && <AlertCircle size={16} />}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </StatusBadge>
              </StatusHeader>

              <ProgressBar>
                <ProgressFill progress={getProgressPercentage()} />
              </ProgressBar>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                    Estimated Delivery
                  </p>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>
                    {formatDate(estimatedDelivery)}
                  </p>
                </div>
                <button
                  onClick={refreshTracking}
                  disabled={isRefreshing}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <RefreshCw size={16} className={isRefreshing ? 'loading' : ''} />
                </button>
              </div>
            </StatusCard>

            {/* Timeline */}
            <TimelineContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CardTitle>
                <Clock size={20} /> Tracking Timeline
              </CardTitle>
              
              {trackingEvents.map((event, index) => (
                <TimelineItem
                  key={event.id}
                  completed={event.completed}
                  active={event.active}
                >
                  <div className="timeline-icon">
                    {event.icon}
                  </div>
                  <div className="timeline-content">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    {event.location && (
                      <p className="location">{event.location}</p>
                    )}
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {formatDate(event.timestamp)}
                    </p>
                  </div>
                </TimelineItem>
              ))}
            </TimelineContainer>

            {/* Map Placeholder */}
            <MapContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div style={{ textAlign: 'center' }}>
                <MapPin size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Live tracking map would be displayed here</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {currentLocation || 'Updating location...'}
                </p>
              </div>
            </MapContainer>
          </MainContent>

          <Sidebar>
            {/* Order Information */}
            <InfoCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CardTitle>
                <Package size={20} /> Order Details
              </CardTitle>
              
              <InfoItem>
                <span className="label">Order Number</span>
                <span className="value">{order.orderNumber}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Tracking Number</span>
                <span className="value">{order.trackingNumber}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Order Date</span>
                <span className="value">{formatDate(order.deliveryDate)}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Total Amount</span>
                <span className="value">{formatCurrency(order.total)}</span>
              </InfoItem>
            </InfoCard>

            {/* Delivery Information */}
            <InfoCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle>
                <MapPin size={20} /> Delivery Info
              </CardTitle>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                  Delivery Address
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#1e293b' }}>
                  {order.deliveryAddress}
                </p>
              </div>

              <InfoItem>
                <span className="label">Estimated Delivery</span>
                <span className="value">{formatDate(estimatedDelivery)}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Current Status</span>
                <span className="value">{order.status}</span>
              </InfoItem>
            </InfoCard>

            {/* Notifications */}
            {order.status === 'in-transit' && (
              <NotificationCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4>🚚 Delivery Update</h4>
                <p>Your order is currently in transit and will be delivered soon!</p>
              </NotificationCard>
            )}

            {/* Action Buttons */}
            <InfoCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardTitle>
                <Navigation size={20} /> Actions
              </CardTitle>
              
              <ActionButtons>
                <ActionButton onClick={handleShareTracking}>
                  <Share2 size={16} />
                  Share Tracking
                </ActionButton>
                
                <ActionButton onClick={handlePrintTracking}>
                  <Printer size={16} />
                  Print Details
                </ActionButton>
                
                <ActionButton onClick={handleDownloadTracking}>
                  <Download size={16} />
                  Download Data
                </ActionButton>
                
                <ActionButton 
                  onClick={toggleNotifications}
                  className={notificationsEnabled ? 'success' : ''}
                >
                  {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                  {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
                </ActionButton>
              </ActionButtons>
            </InfoCard>
          </Sidebar>
        </TrackingGrid>

        {/* Toast Notifications */}
        <AnimatePresence>
          {showToast && (
            <Toast
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {toastType === 'success' && <CheckCircle size={16} color="#10b981" />}
              {toastType === 'error' && <AlertCircle size={16} color="#dc2626" />}
              {toastType === 'info' && <Package size={16} color="#3b82f6" />}
              {toastMessage}
            </Toast>
          )}
        </AnimatePresence>
      </Container>
    </TrackingContainer>
  );
};

export default OrderTracking; 