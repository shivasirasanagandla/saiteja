import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Calendar, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  X, 
  ArrowLeft,
  Shield,
  Phone,
  Truck,
  Leaf,
  Star
} from 'lucide-react';
import { authAPI } from '../services/api';
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
  max-width: 800px;
  width: 100%;
  height: 90vh;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

const RegisterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  overflow: hidden;
  position: relative;

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
  flex-shrink: 0;
  height: 100%;
  position: sticky;
  top: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const LeftPanelContent = styled.div`
  position: relative;
  z-index: 1;
  color: white;
`;

const WelcomeTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const FeatureList = styled.div`
  text-align: left;
  margin-top: 2rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;

  svg {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
    opacity: 0.9;
  }
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  flex: 1;
  position: relative;
`;

const RightPanelHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
`;

const RightPanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 2rem 2rem 2rem;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
  min-height: 0;
  position: relative;
  isolation: isolate;

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

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
  text-align: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
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

  &.error {
    border-color: #ef4444;
  }

  &.success {
    border-color: #10b981;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;

  &:hover {
    color: #374151;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

const StrengthFill = styled.div<{ strength: number }>`
  height: 100%;
  background: ${props => {
    if (props.strength <= 2) return '#ef4444';
    if (props.strength <= 3) return '#f59e0b';
    return '#10b981';
  }};
  width: ${props => (props.strength / 6) * 100}%;
  transition: all 0.3s ease;
`;

const StrengthText = styled.div<{ strength: number }>`
  font-size: 0.75rem;
  color: ${props => {
    if (props.strength <= 2) return '#ef4444';
    if (props.strength <= 3) return '#f59e0b';
    return '#10b981';
  }};
  font-weight: 500;
`;

const RequirementList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Requirement = styled.div<{ met: boolean }>`
  font-size: 0.7rem;
  color: ${props => props.met ? '#10b981' : '#6b7280'};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #374151;

  input[type="radio"] {
    margin: 0;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;

  &.error {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.5;
  cursor: pointer;

  a {
    color: #f59e0b;
    text-decoration: underline;
    
    &:hover {
      color: #d97706;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const MessageContainer = styled.div<{ type: 'error' | 'success' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.type === 'error' ? '#fef2f2' : '#f0fdf4'};
  color: ${props => props.type === 'error' ? '#dc2626' : '#16a34a'};
  border: 1px solid ${props => props.type === 'error' ? '#fecaca' : '#bbf7d0'};
`;

interface RegisterModalProps {
  onRegister: (userData: any) => void;
  onClose: () => void;
  onBackToLogin: () => void;
}

const validateEmail = (email: string) => {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;
  const hasMaxLength = password.length <= 64;
  const noSpaces = !/\s/.test(password);

  return {
    isValid: hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && hasMinLength && hasMaxLength && noSpaces,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    hasMinLength,
    hasMaxLength,
    noSpaces
  };
};

const validatePhone = (phone: string) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const validateDateOfBirth = (dob: string) => {
  if (!dob) return { isValid: true, age: 0 };
  
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
    ? age - 1 
    : age;
  
  return {
    isValid: actualAge >= 13,
    age: actualAge
  };
};

const RegisterModal: React.FC<RegisterModalProps> = ({ onRegister, onClose, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setError('');
    setSuccess('');
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = 'Password does not meet requirements';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.dateOfBirth) {
      const dobValidation = validateDateOfBirth(formData.dateOfBirth);
      if (!dobValidation.isValid) {
        newErrors.dateOfBirth = `You must be at least 13 years old. Current age: ${dobValidation.age}`;
      }
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Mark all fields as touched when form is submitted
      const allFields = ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phone', 'dateOfBirth', 'termsAccepted'];
      setTouched(prev => {
        const newTouched = { ...prev };
        allFields.forEach(field => {
          newTouched[field] = true;
        });
        return newTouched;
      });
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
      };

      const response = await authAPI.register(userData);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        onRegister(response);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.email && 
           formData.password && 
           formData.confirmPassword && 
           formData.firstName && 
           formData.lastName && 
           formData.termsAccepted &&
           formData.password === formData.confirmPassword &&
           validateEmail(formData.email) &&
           validatePassword(formData.password).isValid;
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordStrength = Object.values(passwordValidation).filter(Boolean).length;

    return (
    <ModalWrapper isOpen={true} onClose={onClose} maxWidth="800px">
      <CloseButton onClick={onClose}>
        <X size={20} />
      </CloseButton>

      <RegisterContent>
            <LeftPanel>
              <LeftPanelContent>
                <WelcomeTitle>Join Nature's Dairy</WelcomeTitle>
                <WelcomeSubtitle>
                  Create your account to access fresh dairy products, exclusive offers, and seamless delivery.
                </WelcomeSubtitle>
                
                <FeatureList>
                  <FeatureItem>
                    <Shield size={18} />
                    Secure & Private
                  </FeatureItem>
                  <FeatureItem>
                    <Truck size={18} />
                    Fast Delivery
                  </FeatureItem>
                  <FeatureItem>
                    <Leaf size={18} />
                    Fresh Products
                  </FeatureItem>
                  <FeatureItem>
                    <Star size={18} />
                    Quality Assured
                  </FeatureItem>
                </FeatureList>
              </LeftPanelContent>
            </LeftPanel>

            <RightPanel>
              <RightPanelHeader>
                <BackButton onClick={onBackToLogin}>
                  <ArrowLeft size={16} />
                  Back to Login
                </BackButton>

                <FormTitle>Create Your Account</FormTitle>

                {error && (
                  <MessageContainer type="error">
                    <AlertCircle size={16} />
                    {error}
                  </MessageContainer>
                )}

                {success && (
                  <MessageContainer type="success">
                    <CheckCircle size={16} />
                    {success}
                  </MessageContainer>
                )}
              </RightPanelHeader>

              <RightPanelContent>
                <form onSubmit={handleSubmit}>
                  <FormGrid>
                    <FormField>
                      <Label htmlFor="email">
                        <Mail size={14} />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        placeholder="Enter email"
                        className={
                          touched.email && errors.email ? 'error' : 
                          formData.email && validateEmail(formData.email) ? 'success' : ''
                        }
                      />
                      {touched.email && errors.email && <ErrorMessage><AlertCircle size={12} />{errors.email}</ErrorMessage>}
                      {formData.email && !errors.email && validateEmail(formData.email) && (
                        <SuccessMessage><CheckCircle size={12} />Valid email format</SuccessMessage>
                      )}
                    </FormField>
                  </FormGrid>

                  <FormGrid>
                    <FormField>
                      <Label htmlFor="firstName">
                        <User size={14} />
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        placeholder="Enter first name"
                        className={touched.firstName && errors.firstName ? 'error' : ''}
                      />
                      {touched.firstName && errors.firstName && <ErrorMessage><AlertCircle size={12} />{errors.firstName}</ErrorMessage>}
                    </FormField>

                    <FormField>
                      <Label htmlFor="lastName">
                        <User size={14} />
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        placeholder="Enter last name"
                        className={touched.lastName && errors.lastName ? 'error' : ''}
                      />
                      {touched.lastName && errors.lastName && <ErrorMessage><AlertCircle size={12} />{errors.lastName}</ErrorMessage>}
                    </FormField>
                  </FormGrid>

                  <FormField>
                    <Label htmlFor="password">
                      <Lock size={14} />
                      Password *
                    </Label>
                    <InputGroup>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        placeholder="Enter password"
                        className={
                          touched.password && errors.password ? 'error' : 
                          formData.password && passwordValidation.isValid ? 'success' : ''
                        }
                      />
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </PasswordToggle>
                    </InputGroup>
                    {touched.password && errors.password && <ErrorMessage><AlertCircle size={12} />{errors.password}</ErrorMessage>}
                    
                    {formData.password && (
                      <PasswordStrength>
                        <StrengthBar>
                          <StrengthFill strength={passwordStrength} />
                        </StrengthBar>
                        <StrengthText strength={passwordStrength}>
                          Password Strength: {passwordStrength < 3 ? 'Weak' : passwordStrength < 5 ? 'Medium' : 'Strong'}
                        </StrengthText>
                        <RequirementList>
                          <Requirement met={passwordValidation.hasUpperCase}>
                            {passwordValidation.hasUpperCase ? <CheckCircle size={12} /> : <X size={12} />}
                            Uppercase letter
                          </Requirement>
                          <Requirement met={passwordValidation.hasLowerCase}>
                            {passwordValidation.hasLowerCase ? <CheckCircle size={12} /> : <X size={12} />}
                            Lowercase letter
                          </Requirement>
                          <Requirement met={passwordValidation.hasNumbers}>
                            {passwordValidation.hasNumbers ? <CheckCircle size={12} /> : <X size={12} />}
                            Number
                          </Requirement>
                          <Requirement met={passwordValidation.hasSpecialChar}>
                            {passwordValidation.hasSpecialChar ? <CheckCircle size={12} /> : <X size={12} />}
                            Special character
                          </Requirement>
                          <Requirement met={passwordValidation.hasMinLength}>
                            {passwordValidation.hasMinLength ? <CheckCircle size={12} /> : <X size={12} />}
                            Min 8 characters
                          </Requirement>
                          <Requirement met={passwordValidation.hasMaxLength}>
                            {passwordValidation.hasMaxLength ? <CheckCircle size={12} /> : <X size={12} />}
                            Max 64 characters
                          </Requirement>
                        </RequirementList>
                      </PasswordStrength>
                    )}
                  </FormField>

                  <FormField>
                    <Label htmlFor="confirmPassword">
                      <Lock size={14} />
                      Confirm Password *
                    </Label>
                    <InputGroup>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        placeholder="Confirm password"
                        className={
                          touched.confirmPassword && errors.confirmPassword ? 'error' : 
                          formData.confirmPassword && formData.password === formData.confirmPassword ? 'success' : ''
                        }
                      />
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </PasswordToggle>
                    </InputGroup>
                    {touched.confirmPassword && errors.confirmPassword && <ErrorMessage><AlertCircle size={12} />{errors.confirmPassword}</ErrorMessage>}
                    {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                      <SuccessMessage><CheckCircle size={12} />Passwords match</SuccessMessage>
                    )}
                  </FormField>

                  <FormGrid>
                    <FormField>
                      <Label htmlFor="phone">
                        <Phone size={14} />
                        Mobile Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          handleInputChange('phone', value);
                        }}
                        onBlur={() => handleBlur('phone')}
                        placeholder="1234567890"
                        maxLength={10}
                        className={
                          touched.phone && errors.phone ? 'error' : 
                          formData.phone && validatePhone(formData.phone) ? 'success' : ''
                        }
                      />
                      {touched.phone && errors.phone && <ErrorMessage><AlertCircle size={12} />{errors.phone}</ErrorMessage>}
                      {formData.phone && !errors.phone && validatePhone(formData.phone) && (
                        <SuccessMessage><CheckCircle size={12} />Valid phone number</SuccessMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="dateOfBirth">
                        <Calendar size={14} />
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        onBlur={() => handleBlur('dateOfBirth')}
                        className={touched.dateOfBirth && errors.dateOfBirth ? 'error' : ''}
                      />
                      {touched.dateOfBirth && errors.dateOfBirth && <ErrorMessage><AlertCircle size={12} />{errors.dateOfBirth}</ErrorMessage>}
                    </FormField>
                  </FormGrid>

                  <FormField>
                    <Label>
                      <User size={14} />
                      Gender
                    </Label>
                    <RadioGroup>
                      <RadioLabel>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                        />
                        Male
                      </RadioLabel>
                      <RadioLabel>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                        />
                        Female
                      </RadioLabel>
                      <RadioLabel>
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={formData.gender === 'other'}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                        />
                        Other
                      </RadioLabel>
                    </RadioGroup>
                  </FormField>

                  <CheckboxContainer className={touched.termsAccepted && errors.termsAccepted ? 'error' : ''}>
                    <Checkbox
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                      onBlur={() => handleBlur('termsAccepted')}
                    />
                    <CheckboxLabel htmlFor="termsAccepted">
                      I agree to the <button type="button" onClick={(e) => e.preventDefault()}>Terms and Conditions</button> and{' '}
                      <button type="button" onClick={(e) => e.preventDefault()}>Privacy Policy</button> *
                    </CheckboxLabel>
                  </CheckboxContainer>
                  {touched.termsAccepted && errors.termsAccepted && <ErrorMessage><AlertCircle size={12} />{errors.termsAccepted}</ErrorMessage>}

                  <SubmitButton type="submit" disabled={isLoading || !isFormValid()}>
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </SubmitButton>
                  
                  {/* Additional form sections to make content scrollable */}
                  <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Additional Information</h4>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.5' }}>
                      By creating an account, you agree to receive updates about our products and services. 
                      You can unsubscribe at any time from your account settings.
                    </p>
                  </div>

                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#0c4a6e' }}>Why Choose Nature's Dairy?</h4>
                    <ul style={{ fontSize: '0.9rem', color: '#0369a1', lineHeight: '1.6', paddingLeft: '1rem' }}>
                      <li>Fresh, organic dairy products delivered to your doorstep</li>
                      <li>Quality assurance with every product</li>
                      <li>Fast and reliable delivery service</li>
                      <li>24/7 customer support</li>
                      <li>Exclusive member benefits and discounts</li>
                    </ul>
                  </div>

                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#92400e' }}>Account Benefits</h4>
                    <p style={{ fontSize: '0.9rem', color: '#a16207', lineHeight: '1.5' }}>
                      Get access to exclusive offers, track your orders, save your favorite products, 
                      and enjoy personalized recommendations based on your preferences.
                    </p>
                  </div>
                </form>
                            </RightPanelContent>
            </RightPanel>
          </RegisterContent>
        </ModalWrapper>
      );
    };

    export default RegisterModal; 