import React from 'react';
import styled, { keyframes } from 'styled-components';
import ModalScrollManager from './ModalScrollManager';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const SpinnerContainer = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: ${props => {
    switch (props.size) {
      case 'small': return '8px';
      case 'large': return '24px';
      default: return '16px';
    }
  }};
`;

const Spinner = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  width: ${props => {
    switch (props.size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '16px';
      case 'large': return '32px';
      default: return '24px';
    }
  }};
  border: 2px solid #e5e7eb;
  border-top: 2px solid #f59e0b;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  color: #6b7280;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '12px';
      case 'large': return '16px';
      default: return '14px';
    }
  }};
  font-weight: 500;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Loading...',
  size = 'medium',
  fullScreen = false,
  overlay = false
}) => {
  const content = (
    <SpinnerContainer size={size}>
      <Spinner size={size} />
      <LoadingText size={size}>{text}</LoadingText>
    </SpinnerContainer>
  );

  if (fullScreen) {
    return (
      <>
        <ModalScrollManager isOpen={true} />
        <FullScreenOverlay>
          {content}
        </FullScreenOverlay>
      </>
    );
  }

  if (overlay) {
    return (
      <ModalOverlay>
        {content}
      </ModalOverlay>
    );
  }

  return content;
};

export default LoadingSpinner; 