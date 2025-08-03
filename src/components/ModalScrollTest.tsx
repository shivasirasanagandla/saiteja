import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ModalScrollManager from './ModalScrollManager';

const TestContainer = styled.div`
  min-height: 200vh;
  padding: 20px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
`;

const TestButton = styled.button`
  background: white;
  color: #f59e0b;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 1rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

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
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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

const ModalContent = styled.div`
  padding: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const ScrollContent = styled.div`
  height: 1000px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const ModalScrollTest: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <TestContainer>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
        Modal Scroll Management Test
      </h1>
      
      <div style={{ textAlign: 'center' }}>
        <TestButton onClick={() => setIsModalOpen(true)}>
          Open Test Modal
        </TestButton>
      </div>

      <div style={{ color: 'white', marginTop: '2rem', padding: '1rem' }}>
        <h3>Instructions:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>Scroll down this page to see the background content</li>
          <li>Click "Open Test Modal" to open a modal</li>
          <li>Verify that the background page stops scrolling when modal is open</li>
          <li>Verify that you can scroll within the modal content</li>
          <li>Close the modal and verify that background scrolling is restored</li>
          <li>Check that the scroll position is preserved when modal closes</li>
        </ul>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <ModalScrollManager isOpen={true} />
            <ModalOverlay onClick={() => setIsModalOpen(false)}>
              <ModalContainer
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CloseButton onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </CloseButton>

                <ModalContent>
                  <ModalTitle>Test Modal</ModalTitle>
                  <p>This is a test modal to verify scroll management.</p>
                  <p>Try scrolling within this modal content:</p>
                  
                  <ScrollContent>
                    <h3>Scrollable Content</h3>
                    <p>This content should be scrollable within the modal.</p>
                    {Array.from({ length: 50 }, (_, i) => (
                      <div key={i} style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        Scroll item {i + 1} - This demonstrates that modal content can scroll while background is locked.
                      </div>
                    ))}
                  </ScrollContent>
                </ModalContent>
              </ModalContainer>
            </ModalOverlay>
          </>
        )}
      </AnimatePresence>
    </TestContainer>
  );
};

export default ModalScrollTest; 