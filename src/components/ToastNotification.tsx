import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
`;

const Toast = styled(motion.div)<{ type: 'success' | 'error' | 'info' }>`
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
`;

const IconContainer = styled.div<{ type: 'success' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'success': return '#d1fae5';
      case 'error': return '#fee2e2';
      case 'info': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return '#059669';
      case 'error': return '#dc2626';
      case 'info': return '#2563eb';
      default: return '#6b7280';
    }
  }};
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  margin-bottom: 2px;
`;

const Message = styled.div`
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  title?: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
  title
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      case 'info':
        return <Info size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'info':
        return 'Information';
      default:
        return 'Notification';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <ToastContainer>
          <Toast
            type={type}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              duration: 0.3
            }}
          >
            <IconContainer type={type}>
              {getIcon()}
            </IconContainer>
            <Content>
              <Title>{getTitle()}</Title>
              <Message>{message}</Message>
            </Content>
            <CloseButton onClick={onClose}>
              <X size={16} />
            </CloseButton>
          </Toast>
        </ToastContainer>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification; 