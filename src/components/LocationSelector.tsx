import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Check, Search, Clock, Truck, Shield } from 'lucide-react';

const LocationModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: #64748b;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
    transform: scale(1.1);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.6;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
    background: white;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Section = styled.div`
  h3 {
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const PopularCities = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const CityCard = styled(motion.button)`
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent);
    transition: left 0.6s;
  }

  &:hover {
    border-color: #f59e0b;
    transform: translateY(-4px);
    box-shadow: 0 8px 25px -5px rgba(245, 158, 11, 0.2);
    
    &::before {
      left: 100%;
    }
  }

  &.selected {
    border-color: #f59e0b;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(245, 158, 11, 0.3);
  }
`;

const CityIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);
`;

const CityName = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const OtherCities = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const OtherCityButton = styled.button`
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;

  &:hover {
    border-color: #f59e0b;
    background: #fef3c7;
    color: #92400e;
    transform: translateY(-2px);
  }

  &.selected {
    border-color: #f59e0b;
    background: #f59e0b;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }
`;

const ConfirmButton = styled.button`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 1.25rem 2rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2.5rem;
  width: 100%;
  position: relative;
  overflow: hidden;

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
    background: linear-gradient(135deg, #d97706, #b45309);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(245, 158, 11, 0.4);
    
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

const SelectedLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  margin-top: 1.5rem;
  color: #92400e;
  font-weight: 600;
  border: 1px solid #fbbf24;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const BenefitsSection = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid #e2e8f0;
`;

const BenefitsTitle = styled.h4`
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 0.95rem;

  svg {
    color: #f59e0b;
    width: 18px;
    height: 18px;
  }
`;

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  selectedLocation?: string;
}

const popularCities = [
  { name: 'Bangalore', icon: '🏛️' },
  { name: 'Chandigarh', icon: '🤲' },
  { name: 'Chennai', icon: '🏢' },
  { name: 'Delhi NCR', icon: '🪷' },
  { name: 'Hyderabad', icon: '🕌' },
  { name: 'Jaipur', icon: '🏰' },
  { name: 'Mumbai', icon: '🏛️' },
  { name: 'Pune', icon: '🏢' }
];

const otherCities = [
  'Coimbatore', 'Guntur', 'Kolkata', 'Lucknow', 'Mysore', 
  'Nashik', 'Surat', 'Vijayawada', 'Warangal'
];

const LocationSelector: React.FC<LocationSelectorProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  selectedLocation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelectedLocation, setTempSelectedLocation] = useState(selectedLocation || '');

  const handleConfirm = () => {
    if (tempSelectedLocation) {
      onLocationSelect(tempSelectedLocation);
      onClose();
    }
  };

  const filteredPopularCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOtherCities = otherCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <LocationModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <CloseButton onClick={onClose}>
              <X size={24} />
            </CloseButton>

            <Header>
              <Title>Select Your Location</Title>
              <Subtitle>Choose your delivery location to get fresh dairy products at your doorstep</Subtitle>
            </Header>

            <SearchContainer>
              <SearchIcon>
                <Search size={22} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search for your city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>

            <LocationGrid>
              <Section>
                <h3>
                  <MapPin size={20} />
                  Popular Cities
                </h3>
                <PopularCities>
                  {filteredPopularCities.map((city) => (
                    <CityCard
                      key={city.name}
                      onClick={() => setTempSelectedLocation(city.name)}
                      className={tempSelectedLocation === city.name ? 'selected' : ''}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CityIcon>{city.icon}</CityIcon>
                      <CityName>{city.name}</CityName>
                    </CityCard>
                  ))}
                </PopularCities>
              </Section>

              <Section>
                <h3>
                  <MapPin size={20} />
                  Other Cities
                </h3>
                <OtherCities>
                  {filteredOtherCities.map((city) => (
                    <OtherCityButton
                      key={city}
                      onClick={() => setTempSelectedLocation(city)}
                      className={tempSelectedLocation === city ? 'selected' : ''}
                    >
                      {city}
                    </OtherCityButton>
                  ))}
                </OtherCities>
              </Section>
            </LocationGrid>

            {tempSelectedLocation && (
              <SelectedLocation>
                <Check size={18} />
                Selected: {tempSelectedLocation}
              </SelectedLocation>
            )}

            <BenefitsSection>
              <BenefitsTitle>Why Choose Nature's Dairy?</BenefitsTitle>
              <BenefitsList>
                <BenefitItem>
                  <Clock size={18} />
                  <span>Same Day Delivery</span>
                </BenefitItem>
                <BenefitItem>
                  <Truck size={18} />
                  <span>Free Delivery</span>
                </BenefitItem>
                <BenefitItem>
                  <Shield size={18} />
                  <span>Quality Guaranteed</span>
                </BenefitItem>
              </BenefitsList>
            </BenefitsSection>

            <ConfirmButton
              onClick={handleConfirm}
              disabled={!tempSelectedLocation}
            >
              Confirm Location
            </ConfirmButton>
          </ModalContent>
        </LocationModal>
      )}
    </AnimatePresence>
  );
};

export default LocationSelector; 