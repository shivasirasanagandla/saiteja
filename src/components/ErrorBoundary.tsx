import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #fef3c7 100%);
  text-align: center;
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  border: 1px solid #e2e8f0;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: #dc2626;
`;

const ErrorTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: left;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #374151;
`;

const ErrorSummary = styled.summary`
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  font-size: 0.875rem;

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

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <AlertTriangle size={40} />
            </ErrorIcon>
            
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            
            <ErrorMessage>
              We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
            </ErrorMessage>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <ErrorSummary>Error Details (Development)</ErrorSummary>
                <div>
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      <br />
                      <strong>Component Stack:</strong>
                      <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </ErrorDetails>
            )}

            <ButtonGroup>
              <Button variant="primary" onClick={this.handleRetry}>
                <RefreshCw size={16} />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome}>
                <Home size={16} />
                Go Home
              </Button>
            </ButtonGroup>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 