import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { authAPI } from '../services/api';

const TestContainer = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const TestButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  font-size: 16px;

  &:hover {
    background: #d97706;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const StatusBox = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
  background: ${props => 
    props.type === 'success' ? '#d4edda' :
    props.type === 'error' ? '#f8d7da' :
    '#d1ecf1'
  };
  color: ${props => 
    props.type === 'success' ? '#155724' :
    props.type === 'error' ? '#721c24' :
    '#0c5460'
  };
  border: 1px solid ${props => 
    props.type === 'success' ? '#c3e6cb' :
    props.type === 'error' ? '#f5c6cb' :
    '#bee5eb'
  };
`;

const BackendTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setStatus('Testing backend connection...');
    setStatusType('info');

    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Backend is running! Status: ${data.status}`);
        setStatusType('success');
      } else {
        setStatus('❌ Backend is not responding properly');
        setStatusType('error');
      }
    } catch (error) {
      setStatus('❌ Cannot connect to backend server. Make sure the server is running on port 5000.');
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setStatus('Testing registration...');
    setStatusType('info');

    try {
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        mobile: '9876543210'
      };

      const response = await authAPI.register(testUser);
      setStatus(`✅ Registration successful! User ID: ${response.user.id}`);
      setStatusType('success');
    } catch (error: any) {
      setStatus(`❌ Registration failed: ${error.message}`);
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setStatus('Testing login...');
    setStatusType('info');

    try {
      const response = await authAPI.loginWithEmail('test@example.com', 'TestPassword123!');
      setStatus(`✅ Login successful! User: ${response.user.firstName} ${response.user.lastName}`);
      setStatusType('success');
    } catch (error: any) {
      setStatus(`❌ Login failed: ${error.message}`);
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TestContainer>
      <h1>Backend Connection Test</h1>
      
      <div>
        <TestButton 
          onClick={testBackendConnection} 
          disabled={isLoading}
        >
          Test Backend Connection
        </TestButton>

        <TestButton 
          onClick={testRegistration} 
          disabled={isLoading}
        >
          Test Registration
        </TestButton>

        <TestButton 
          onClick={testLogin} 
          disabled={isLoading}
        >
          Test Login
        </TestButton>
      </div>

      {status && (
        <StatusBox type={statusType}>
          {status}
        </StatusBox>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>First, make sure the backend server is running on port 5000</li>
          <li>Click "Test Backend Connection" to verify the server is up</li>
          <li>Click "Test Registration" to test user registration</li>
          <li>Click "Test Login" to test user login</li>
        </ol>
      </div>
    </TestContainer>
  );
};

export default BackendTest; 