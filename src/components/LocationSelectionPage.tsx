import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, ArrowRight, Truck, Leaf, Star, Droplets, Shield, Clock, Heart } from 'lucide-react';
import LocationSelector from './LocationSelector';

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

const LocationContainer = styled.div`
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

const LocationForm = styled(motion.div)`
  width: 100%;
  max-width: 500px;
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

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fbbf24;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  color: #92400e;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const LocationButton = styled.button`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1.25rem 2rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px -3px rgba(245, 158, 11, 0.4);
    
    &::before {
      left: 100%;
    }
  }

  &:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SkipButton = styled.button`
  background: white;
  border: 2px solid #e2e8f0;
  color: #64748b;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover:not(:disabled) {
    border-color: #f59e0b;
    color: #f59e0b;
    transform: translateY(-1px);
    background: #fef3c7;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
  width: 100%;
`;

const BenefitCard = styled(motion.div)`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: #f59e0b;
    background: #fef3c7;
  }

  h4 {
    color: #1e293b;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.1rem;
  }

  p {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.5;
  }

  svg {
    color: #f59e0b;
  }
`;

interface LocationSelectionPageProps {
  user: { type: 'email'|'mobile', value: string };
  onLocationSelect: (location: string) => void;
  onSkip: () => void;
}

const LocationSelectionPage: React.FC<LocationSelectionPageProps> = ({ 
  user, 
  onLocationSelect, 
  onSkip 
}) => {
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (location: string) => {
    if (!location.trim()) {
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLocationSelect(location);
    }, 500);
  };

  const handleSkip = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSkip();
    }, 300);
  };

  const handleOpenLocationSelector = () => {
    setShowLocationSelector(true);
  };

  const handleCloseLocationSelector = () => {
    setShowLocationSelector(false);
  };

  return (
    <PageWrapper>
      <LocationContainer>
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
          <LocationForm
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FormHeader>
              <FormTitle>Select Your Location</FormTitle>
              <FormSubtitle>
                Choose your delivery location to get fresh dairy products at your doorstep
              </FormSubtitle>
            </FormHeader>

            <WelcomeMessage>
              <CheckCircle size={18} />
              Successfully logged in as {user.value}
            </WelcomeMessage>

            <LocationButton 
              onClick={handleOpenLocationSelector}
              disabled={isLoading}
            >
              <MapPin size={20} />
              {isLoading ? 'Loading...' : 'Choose Your Location'}
              <ArrowRight size={20} />
            </LocationButton>

            <SkipButton 
              onClick={handleSkip}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Skip for now'}
            </SkipButton>

            <BenefitsGrid>
              <BenefitCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4>
                  <Clock size={18} />
                  Fast Delivery
                </h4>
                <p>Fresh milk delivered within 3 hours of milking</p>
              </BenefitCard>
              <BenefitCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4>
                  <Droplets size={18} />
                  Pure Fresh Milk
                </h4>
                <p>From our indigenous Gir and Sahiwal cows</p>
              </BenefitCard>
              <BenefitCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4>
                  <Heart size={18} />
                  Organic
                </h4>
                <p>No hormones, no antibiotics, just pure goodness</p>
              </BenefitCard>
            </BenefitsGrid>

            {showLocationSelector && (
              <LocationSelector
                isOpen={showLocationSelector}
                onClose={handleCloseLocationSelector}
                onLocationSelect={handleLocationSelect}
                selectedLocation=""
              />
            )}
          </LocationForm>
        </RightPanel>
      </LocationContainer>
    </PageWrapper>
  );
};

export default LocationSelectionPage; 