import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Smartphone, Lock, UserCheck, UserPlus, KeyRound, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, Zap, Droplets, Heart, Star, Milk, Coffee, IceCream, Shield, Truck, Leaf } from 'lucide-react';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(1deg); }
    66% { transform: translateY(10px) rotate(-1deg); }
  }
`;

const LoginContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-height: 600px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
`;

const LeftPanel = styled.div`
  background: url('/images/dairy.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 100%;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.7) 0%, rgba(217, 119, 6, 0.7) 100%);
    z-index: 1;
  }
`;

const RightPanel = styled.div`
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  position: relative;
`;

const BrandSection = styled.div`
  position: relative;
  z-index: 10;
  color: white;
  margin-bottom: 2rem;
`;



const BrandTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BrandSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FeaturesList = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  font-size: 1rem;
  
  svg {
    width: 20px;
    height: 20px;
    opacity: 0.9;
  }
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  z-index: 1;
`;

const MilkBottle = styled(FloatingElement)`
  width: 40px;
  height: 60px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%);
  border-radius: 8px 8px 20px 20px;
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.9);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: rgba(59, 130, 246, 0.3);
    border-radius: 50%;
  }
`;

const CheeseWheel = styled(FloatingElement)`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.4);
`;

const IceCreamCone = styled(FloatingElement)`
  width: 35px;
  height: 45px;
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 50%, #f87171 100%);
  border-radius: 50% 50% 0 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 12px solid #8b4513;
  }
`;

const LoginForm = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const FormTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: #f8fafc;
  padding: 4px;
  border: 1px solid #e2e8f0;
`;

const Tab = styled.button<{active: boolean}>`
  flex: 1;
  padding: 0.75rem 1rem;
  background: ${({active}) => active ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent'};
  color: ${({active}) => active ? 'white' : '#64748b'};
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 8px;
  position: relative;

  &:hover {
    color: ${({active}) => active ? 'white' : '#1e293b'};
    transform: ${({active}) => active ? 'none' : 'translateY(-1px)'};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  background: white;
  color: #1e293b;
  
  &:focus { 
    border-color: #f59e0b; 
    outline: none; 
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 1rem 0;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px -3px rgba(245, 158, 11, 0.4);
  }

  &:disabled { 
    background: #e2e8f0; 
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
`;

const SuccessMsg = styled.div`
  color: #22c55e;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
`;

const PasswordStrengthIndicator = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.25rem;
`;

const StrengthBar = styled.div<{ strength: number; index: number }>`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: ${props => {
    if (props.index < props.strength) {
      if (props.strength <= 2) return '#fca5a5';
      if (props.strength <= 3) return '#fbbf24';
      return '#86efac';
    }
    return '#e2e8f0';
  }};
  transition: all 0.3s ease;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.3s ease;
  z-index: 1;

  &:hover {
    color: #1e293b;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SocialLoginButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  &:hover {
    border-color: #f59e0b;
    background: #fef3c7;
    transform: translateY(-1px);
  }
`;

const RateLimitMessage = styled.div`
  color: #ef4444;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fecaca;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #64748b;
  font-size: 0.85rem;

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

const LinkText = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #64748b;

  a {
    color: #f59e0b;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #f59e0b;
  }

  label {
    font-size: 0.9rem;
    color: #64748b;
    cursor: pointer;
  }
`;

const Toast = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  max-width: 300px;
  border: 1px solid #e2e8f0;
  color: #1e293b;
`;

interface LoginPageProps {
  onLogin: (user: { type: 'email'|'mobile', value: string }) => void;
}

type Mode = 'login' | 'register' | 'forgot';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [tab, setTab] = useState<'mobile'|'email'>('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input'|'otp'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [remember, setRemember] = useState(false);
  
  // Advanced features state
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Persistent login
  useEffect(() => {
    const saved = localStorage.getItem('naturesdairy_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user && user.type && user.value) {
          onLogin(user);
        }
      } catch {}
    }
  }, [onLogin]);

  // Reset on mode/tab change
  useEffect(() => {
    setStep('input'); setError(''); setSuccess(''); setOtp(''); setPassword('');
  }, [tab, mode]);

  // Password strength calculator
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  // Password strength effect
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  // Rate limiting for OTP
  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  // Toast notification
  const showToastNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Google login handler
  const handleGoogleLogin = () => {
    showToastNotification('Google login feature coming soon!', 'info');
  };

  // Mock send OTP with rate limiting
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setSuccess('');
    
    if (!mobile.trim()) {
      setError('Please enter your mobile number');
      return;
    }
    
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    
    if (otpAttempts >= 3) {
      setOtpCooldown(60);
      setError('Too many OTP attempts. Please wait 60 seconds.');
      showToastNotification('Rate limit exceeded. Please wait before trying again.', 'error');
      return;
    }
    
    if (otpCooldown > 0) {
      setError(`Please wait ${otpCooldown} seconds before requesting another OTP.`);
      return;
    }
    
    setLoading(true);
    setOtpAttempts(prev => prev + 1);
    
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setSuccess('OTP sent to your mobile number');
      showToastNotification('OTP sent successfully!', 'success');
    }, 1000);
  };

  // Mock verify OTP (login/register)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }
    
    if (otp !== '1234') {
      setError('Invalid OTP. Try 1234 for demo.');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(mode==='register' ? 'Registration successful!' : 'Login successful!');
      const user: { type: 'mobile', value: string } = { type: 'mobile', value: mobile };
      if (remember) localStorage.setItem('naturesdairy_user', JSON.stringify(user));
      onLogin(user);
    }, 1000);
  };

  // Mock email login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Login successful!');
      const user: { type: 'email', value: string } = { type: 'email', value: email };
      if (remember) localStorage.setItem('naturesdairy_user', JSON.stringify(user));
      onLogin(user);
    }, 1000);
  };

  // Mock email registration
  const handleEmailRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Registration successful!');
      const user: { type: 'email', value: string } = { type: 'email', value: email };
      if (remember) localStorage.setItem('naturesdairy_user', JSON.stringify(user));
      onLogin(user);
    }, 1000);
  };

  // Mock forgot password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Password reset link sent to your email (mock).');
      showToastNotification('Password reset link sent!', 'success');
    }, 1000);
  };

  return (
    <PageWrapper>
      <LoginContainer>
        <LeftPanel>
          <BrandSection>
            <BrandTitle>Nature's Dairy</BrandTitle>
            <BrandSubtitle>
              Fresh, organic dairy products delivered to your doorstep. 
              Experience the pure taste of nature.
            </BrandSubtitle>
          </BrandSection>
          
          <FeaturesList>
            <FeatureItem>
              <Shield size={20} />
              <span>100% Organic & Natural</span>
            </FeatureItem>
            <FeatureItem>
              <Truck size={20} />
              <span>Same Day Delivery</span>
            </FeatureItem>
            <FeatureItem>
              <Leaf size={20} />
              <span>Eco-Friendly Packaging</span>
            </FeatureItem>
            <FeatureItem>
              <Star size={20} />
              <span>Premium Quality Products</span>
            </FeatureItem>
          </FeaturesList>
        </LeftPanel>

        <RightPanel>
          <LoginForm
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FormHeader>
              <FormTitle>
                {mode==='login' && "Welcome Back"}
                {mode==='register' && "Create Account"}
                {mode==='forgot' && "Reset Password"}
              </FormTitle>
              <FormSubtitle>
                {mode==='login' && "Sign in to your account to continue"}
                {mode==='register' && "Join us for fresh dairy products"}
                {mode==='forgot' && "Enter your email to receive reset instructions"}
              </FormSubtitle>
            </FormHeader>
            
            {mode!=='forgot' && (
              <Tabs>
                <Tab active={tab==='mobile'} onClick={()=>{setTab('mobile');}}>
                  <Smartphone size={16}/> Mobile
                </Tab>
                <Tab active={tab==='email'} onClick={()=>{setTab('email');}}>
                  <Mail size={16}/> Email
                </Tab>
              </Tabs>
            )}
            
            {/* Login with mobile */}
            {mode==='login' && tab==='mobile' && step==='input' && (
              <Form onSubmit={handleSendOtp}>
                <InputGroup>
                  <Label htmlFor="mobile">
                    <Smartphone size={16} />
                    Mobile Number
                  </Label>
                  <Input 
                    id="mobile" 
                    type="tel" 
                    maxLength={10} 
                    value={mobile} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g,'');
                      setMobile(value);
                    }} 
                    placeholder="Enter 10-digit mobile" 
                    autoFocus 
                  />
                </InputGroup>
                {error && <ErrorMsg><AlertCircle size={14} /> {error}</ErrorMsg>}
                {otpCooldown > 0 && (
                  <RateLimitMessage>
                    <AlertCircle size={14} />
                    Wait {otpCooldown}s before next OTP
                  </RateLimitMessage>
                )}
                <Button type="submit" disabled={loading || otpCooldown > 0}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
                <Divider>
                  <span>or</span>
                </Divider>
                <SocialLoginButton onClick={handleGoogleLogin}>
                  <Zap size={16} />
                  Continue with Google
                </SocialLoginButton>
                <LinkText>
                  New user? <button type="button" onClick={()=>setMode('register')} style={{background:'none',border:'none',color:'var(--primary-500)',cursor:'pointer',textDecoration:'underline'}}>Register</button>
                </LinkText>
              </Form>
            )}
            
            {/* Login with mobile OTP */}
            {mode==='login' && tab==='mobile' && step==='otp' && (
              <Form onSubmit={handleVerifyOtp}>
                <InputGroup>
                  <Label htmlFor="otp">
                    <KeyRound size={16} />
                    Enter OTP
                  </Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    maxLength={4} 
                    value={otp} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g,'');
                      setOtp(value);
                    }} 
                    placeholder="Enter 4-digit OTP" 
                    autoFocus 
                  />
                </InputGroup>
                {error && <ErrorMsg><AlertCircle size={14} /> {error}</ErrorMsg>}
                <Button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Button>
                <LinkText>
                  <button type="button" onClick={()=>setStep('input')} style={{background:'none',border:'none',color:'var(--primary-500)',cursor:'pointer',textDecoration:'underline'}}>Back</button>
                </LinkText>
              </Form>
            )}
            
            {/* Login with email */}
            {mode==='login' && tab==='email' && (
              <Form onSubmit={handleEmailLogin}>
                <InputGroup>
                  <Label htmlFor="email">
                    <Mail size={16} />
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email" 
                    autoFocus 
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="password">
                    <Lock size={16} />
                    Password
                  </Label>
                  <InputWrapper>
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Enter password" 
                      style={{ paddingRight: '3rem' }}
                    />
                    <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </PasswordToggle>
                  </InputWrapper>
                  {password && (
                    <PasswordStrengthIndicator>
                      {[1, 2, 3, 4, 5].map((index) => (
                        <StrengthBar key={index} strength={passwordStrength} index={index} />
                      ))}
                    </PasswordStrengthIndicator>
                  )}
                </InputGroup>
                <CheckboxWrapper>
                  <input type="checkbox" id="remember" checked={remember} onChange={e=>setRemember(e.target.checked)} />
                  <label htmlFor="remember">Remember Me</label>
                </CheckboxWrapper>
                {error && <ErrorMsg><AlertCircle size={14} /> {error}</ErrorMsg>}
                <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
                <LinkText>
                  <button type="button" onClick={()=>setMode('forgot')} style={{background:'none',border:'none',color:'var(--primary-500)',cursor:'pointer',textDecoration:'underline'}}>Forgot Password?</button> | 
                  New user? <button type="button" onClick={()=>setMode('register')} style={{background:'none',border:'none',color:'var(--primary-500)',cursor:'pointer',textDecoration:'underline'}}>Register</button>
                </LinkText>
              </Form>
            )}
            
            {/* Register with mobile */}
            {mode==='register' && tab==='mobile' && step==='input' && (
              <Form onSubmit={handleSendOtp}>
                <InputGroup>
                  <Label htmlFor="mobile">
                    <Smartphone size={16} />
                    Mobile Number
                  </Label>
                  <Input id="mobile" type="tel" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,''))} placeholder="Enter 10-digit mobile" autoFocus />
                </InputGroup>
                {error && <ErrorMsg><AlertCircle size={14} /> {error}</ErrorMsg>}
                <Button type="submit" disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP'}</Button>
                <LinkText>
                  Already have an account? <button type="button" onClick={()=>setMode('login')} style={{background:'none',border:'none',color:'var(--primary-500)',cursor:'pointer',textDecoration:'underline'}}>Login</button>
                </LinkText>
              </Form>
            )}
            
            {/* Register with mobile OTP */}
            {mode==='register' && tab==='mobile' && step==='otp' && (
              <Form onSubmit={handleVerifyOtp}>
                <InputGroup>
                  <Label htmlFor="otp">
                    <KeyRound size={16} />
                    Enter OTP
                  </Label>
                  <Input id="otp" type="text" maxLength={4} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} placeholder="Enter 4-digit OTP (try 1234)" autoFocus />
                </InputGroup>
                {error && <ErrorMsg><AlertCircle size={14} /> {error}</ErrorMsg>}
                <Button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Button>
                <LinkText>
                  <button type="button" onClick={()=>setStep('input')} style={{background:'none',border:'none',color:'var(--primary-500)',cursor:'pointer',textDecoration:'underline'}}>Back</button>
                </LinkText>
              </Form>
            )}
            
            {/* Register with email */}
            {mode==='register' && tab==='email' && (
              <Form onSubmit={handleEmailRegister}>
                <InputGroup>
                  <Label htmlFor="email">
                    <Mail size={16} />
                    Email Address
                  </Label>
                  <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" autoFocus />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="password">
                    <Lock size={16} />
                    Password
                  </Label>
                  <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create password" />
                </InputGroup>
                <CheckboxWrapper>
                  <input type="checkbox" id="remember" checked={remember} onChange={e=>setRemember(e.target.checked)} />
                  <label htmlFor="remember">Remember Me</label>
                </CheckboxWrapper>
                {error && <ErrorMsg><AlertCircle size={14} /> {error}</ErrorMsg>}
                <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
                <LinkText>
                  Already have an account? <button type="button" onClick={()=>setMode('login')} style={{background:'none',border:'none',color:'var(--primary-500)',cursor:'pointer',textDecoration:'underline'}}>Login</button>
                </LinkText>
              </Form>
            )}
            
            {/* Forgot password */}
            {mode==='forgot' && (
              <Form onSubmit={handleForgotPassword}>
                <InputGroup>
                  <Label htmlFor="email">
                    <Mail size={16} />
                    Email Address
                  </Label>
                  <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" autoFocus />
                </InputGroup>
                {error && <ErrorMsg><AlertCircle size={14} /> {error}</ErrorMsg>}
                <Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
                <LinkText>
                  <button type="button" onClick={()=>setMode('login')} style={{background:'none',border:'none',color:'var(--primary-500)',cursor:'pointer',textDecoration:'underline'}}>Back to Login</button>
                </LinkText>
              </Form>
            )}
            
            {success && <SuccessMsg><CheckCircle size={18}/> {success}</SuccessMsg>}
          </LoginForm>
        </RightPanel>
      </LoginContainer>
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <Toast
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {toastType === 'success' && <CheckCircle size={16} color="#22c55e" />}
            {toastType === 'error' && <AlertCircle size={16} color="#ef4444" />}
            {toastType === 'info' && <Zap size={16} color="#3b82f6" />}
            {toastMessage}
          </Toast>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default LoginPage; 