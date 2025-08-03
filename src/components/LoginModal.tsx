import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, Lock, UserCheck, UserPlus, KeyRound, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Zap, Droplets, Heart, Star, Milk, Coffee, IceCream, Shield, Truck, Leaf, X } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

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
  overflow: hidden;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  width: 900px;
  height: 500px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 95vw;
    height: 80vh;
    max-width: 600px;
    max-height: 400px;
  }
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

const LoginContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  width: 100%;

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
  height: 100%;

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



const FreshDairyImage = styled.div`
  width: 100%;
  height: 250px;
  background-image: url('/images/dairy.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%);
    border-radius: 16px;
  }
`;

const DairyProductsImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url('/images/dairy.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%);
    border-radius: 16px;
  }
`;

const RightPanel = styled.div`
  padding: 2rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  position: relative;
  overflow-y: auto;
  height: 100%;
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
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const BrandTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 2;
`;

const BrandSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.6;
  position: relative;
  z-index: 2;
`;

const LoginTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const LoginSubtitle = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const MethodSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #f8fafc;
  padding: 0.25rem;
  border-radius: 12px;
`;

const MethodButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#1e293b' : '#64748b'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: ${props => props.active ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    color: ${props => props.active ? '#1e293b' : '#374151'};
  }
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

const PrimaryButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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

const SecondaryButton = styled.button`
  background: white;
  color: #374151;
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #9ca3af;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  span {
    padding: 0 1rem;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.9rem;

  a {
    color: #f59e0b;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface LoginModalProps {
  onLogin: (user: { type: 'email'|'mobile', value: string }) => void;
  onRegister: (data: { type: 'register' }) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onRegister, onClose }) => {
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setError('');
    setIsLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      setError(''); // Clear any previous errors
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }
    
    setError('');
    setIsLoading(true);
    // Simulate OTP verification (use 1234 as demo OTP)
    setTimeout(() => {
      if (otp === '1234') {
        onLogin({ type: 'mobile', value: mobile });
        setIsLoading(false);
      } else {
        setError('Invalid OTP. Please try again. (Use 1234 for demo)');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({ type: 'email', value: email });
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google login
    setTimeout(() => {
      onLogin({ type: 'email', value: 'user@gmail.com' });
      setIsLoading(false);
    }, 1000);
  };

  const resetMobileFlow = () => {
    setOtpSent(false);
    setOtp('');
    setError('');
  };

  return (
    <ModalWrapper isOpen={true} onClose={onClose} maxWidth="500px">
      <CloseButton onClick={onClose}>×</CloseButton>
      
      <LoginContent>
          <LeftPanel>
            <DairyProductsImage />
            <BrandLogo>
              <Milk size={24} color="white" />
            </BrandLogo>
            <BrandTitle>Nature's Dairy</BrandTitle>
            <BrandSubtitle>
              Fresh, organic dairy products delivered to your doorstep
            </BrandSubtitle>
          </LeftPanel>
          
          <RightPanel>
            <LoginTitle>Welcome Back</LoginTitle>
            <LoginSubtitle>Sign in to your account to continue</LoginSubtitle>
            
            <MethodSelector>
              <MethodButton
                active={method === 'mobile'}
                onClick={() => {
                  setMethod('mobile');
                  resetMobileFlow();
                }}
              >
                <Smartphone size={16} />
                Mobile
              </MethodButton>
              <MethodButton
                active={method === 'email'}
                onClick={() => setMethod('email')}
              >
                <Mail size={16} />
                Email
              </MethodButton>
            </MethodSelector>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            {method === 'mobile' ? (
              !otpSent ? (
                <Form onSubmit={handleSendOtp}>
                  <InputGroup>
                    <Label>
                      <Smartphone size={16} />
                      Mobile Number
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      required
                    />
                  </InputGroup>
                  
                  <PrimaryButton type="submit" disabled={isLoading || !mobile || mobile.length !== 10}>
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </PrimaryButton>
                </Form>
              ) : (
                <Form onSubmit={handleVerifyOtp}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <p style={{ color: '#059669', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      ✓ OTP sent to {mobile}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      Demo OTP: <strong>1234</strong>
                    </p>
                  </div>
                  
                  <InputGroup>
                    <Label>
                      <KeyRound size={16} />
                      Enter OTP
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      required
                    />
                  </InputGroup>
                  
                  <PrimaryButton type="submit" disabled={isLoading || !otp || otp.length !== 4}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </PrimaryButton>
                  
                  <SecondaryButton 
                    type="button" 
                    onClick={resetMobileFlow}
                    style={{ marginTop: '0.5rem' }}
                  >
                    <ArrowLeft size={16} />
                    Change Mobile Number
                  </SecondaryButton>
                </Form>
              )
            ) : (
              <Form onSubmit={handleEmailLogin}>
                <InputGroup>
                  <Label>
                    <Mail size={16} />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>
                    <Lock size={16} />
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
                
                <PrimaryButton type="submit" disabled={isLoading || !email || !password}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </PrimaryButton>
              </Form>
            )}

            <Divider>
              <span>or</span>
            </Divider>

            <SecondaryButton onClick={handleGoogleLogin} disabled={isLoading}>
              <Zap size={16} />
              Continue with Google
            </SecondaryButton>

            <RegisterLink>
              New user? <a onClick={() => onRegister({ type: 'register' })}>Register</a>
            </RegisterLink>
          </RightPanel>
        </LoginContent>
      </ModalWrapper>
    );
  };

  export default LoginModal; 