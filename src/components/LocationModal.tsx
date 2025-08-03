import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, ArrowRight, Droplets, Clock, Milk, Search } from 'lucide-react';
import ModalScrollManager from './ModalScrollManager';

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
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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

const LocationContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;

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

const RightPanel = styled.div`
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: white;
  position: relative;
  overflow-y: auto;
  max-height: 90vh;
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
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
`;

const BrandTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
`;

const BrandSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.5;
  position: relative;
  z-index: 2;
`;

const LocationTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const LocationSubtitle = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const SuccessMessage = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #92400e;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

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

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const CitiesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const CityCard = styled.button<{ selected: boolean }>`
  background: ${props => props.selected ? '#fef3c7' : 'white'};
  border: 2px solid ${props => props.selected ? '#f59e0b' : '#e2e8f0'};
  border-radius: 8px;
  padding: 0.75rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: #f59e0b;
    background: ${props => props.selected ? '#fef3c7' : '#f8fafc'};
  }
`;

const CityIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
`;

const CityInfo = styled.div`
  flex: 1;
`;

const CityName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const CityDetails = styled.div`
  font-size: 0.8rem;
  color: #64748b;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PrimaryButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1rem;

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
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1rem;

  &:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }
`;

const FeatureCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const FeatureCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  color: white;
`;

const FeatureTitle = styled.h4`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  font-size: 0.8rem;
  line-height: 1.4;
`;

interface LocationModalProps {
  user: { type: 'email'|'mobile', value: string };
  onLocationSelect: (location: string) => void;
  onSkip: () => void;
  onClose: () => void;
}

const cities = [
  { id: 1, name: 'Mumbai', state: 'Maharashtra', delivery: 'Same Day', icon: '🏙️' },
  { id: 2, name: 'Delhi', state: 'Delhi', delivery: 'Same Day', icon: '🏛️' },
  { id: 3, name: 'Bangalore', state: 'Karnataka', delivery: 'Next Day', icon: '🌆' },
  { id: 4, name: 'Hyderabad', state: 'Telangana', delivery: 'Next Day', icon: '🏢' },
  { id: 5, name: 'Chennai', state: 'Tamil Nadu', delivery: 'Next Day', icon: '🏭' },
  { id: 6, name: 'Pune', state: 'Maharashtra', delivery: 'Same Day', icon: '🎓' },
  { id: 7, name: 'Ahmedabad', state: 'Gujarat', delivery: 'Next Day', icon: '🏺' },
  { id: 8, name: 'Kolkata', state: 'West Bengal', delivery: 'Next Day', icon: '🎭' }
];

const LocationModal: React.FC<LocationModalProps> = ({ user, onLocationSelect, onSkip, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleSkip = () => {
    onSkip();
  };

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ModalScrollManager isOpen={true} />
      <AnimatePresence>
        <ModalOverlay onClick={onClose}>
          <ModalContainer
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <LocationContent>
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
            <LocationTitle>Choose Your Location</LocationTitle>
            <LocationSubtitle>
              Select your delivery location to get fresh dairy products
            </LocationSubtitle>

            <SuccessMessage>
              <CheckCircle size={20} />
              Successfully logged in as {user.value}
            </SuccessMessage>

            <SearchContainer>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search for your city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>

            <CitiesGrid>
              {filteredCities.map((city) => (
                <CityCard
                  key={city.id}
                  selected={selectedLocation === city.name}
                  onClick={() => setSelectedLocation(city.name)}
                >
                  <CityIcon>
                    <span style={{ fontSize: '1rem' }}>{city.icon}</span>
                  </CityIcon>
                  <CityInfo>
                    <CityName>{city.name}</CityName>
                    <CityDetails>
                      {city.state} • {city.delivery} Delivery
                    </CityDetails>
                  </CityInfo>
                </CityCard>
              ))}
            </CitiesGrid>

            <ActionButtons>
              <PrimaryButton 
                onClick={() => handleLocationSelect(selectedLocation)}
                disabled={!selectedLocation}
              >
                <MapPin size={20} />
                {selectedLocation ? `Continue with ${selectedLocation}` : 'Select a location'}
                <ArrowRight size={16} />
              </PrimaryButton>
              
              <SecondaryButton onClick={handleSkip}>
                Skip for now
              </SecondaryButton>
            </ActionButtons>

            <FeatureCards>
              <FeatureCard>
                <FeatureIcon>
                  <Clock size={20} />
                </FeatureIcon>
                <FeatureTitle>Fast Delivery</FeatureTitle>
                <FeatureDescription>
                  Fresh milk delivered within 3 hours of milking
                </FeatureDescription>
              </FeatureCard>
              
              <FeatureCard>
                <FeatureIcon>
                  <Droplets size={20} />
                </FeatureIcon>
                <FeatureTitle>Pure Fresh Milk</FeatureTitle>
                <FeatureDescription>
                  From our indigenous Gir and Sahiwal cows
                </FeatureDescription>
              </FeatureCard>
            </FeatureCards>
          </RightPanel>
        </LocationContent>
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
    </>
  );
};

export default LocationModal; 