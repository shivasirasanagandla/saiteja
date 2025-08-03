import React, { useState } from 'react';
import styled from 'styled-components';
import ModalWrapper from './ModalWrapper';

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

const ModalContent = styled.div`
  padding: 2rem;
  max-height: 400px;
  overflow-y: auto;
`;

const ModalTest: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <TestContainer>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
        Modal Scroll Test
      </h1>
      
      <div style={{ textAlign: 'center' }}>
        <TestButton onClick={() => setIsModalOpen(true)}>
          Open Test Modal
        </TestButton>
      </div>

      <div style={{ color: 'white', marginTop: '2rem', padding: '1rem' }}>
        <h3>Instructions:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>Scroll down this page to see background content</li>
          <li>Click "Open Test Modal" to open a modal</li>
          <li>Try scrolling - background should be locked</li>
          <li>Scroll within modal content - should work</li>
          <li>Close modal - background scroll should be restored</li>
        </ul>
      </div>

      <ModalWrapper isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <h2>Test Modal</h2>
          <p>This modal should prevent background scrolling.</p>
          <p>Try scrolling within this modal content:</p>
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
              Scroll item {i + 1} - This demonstrates modal scrolling while background is locked.
            </div>
          ))}
        </ModalContent>
      </ModalWrapper>
    </TestContainer>
  );
};

export default ModalTest; 