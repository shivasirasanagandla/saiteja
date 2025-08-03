import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FeaturedProducts from './FeaturedProducts';
import { scrollToTop } from '../utils/scrollToTop';

const HeroSection = styled.section`
  min-height: 100vh;
  background: url('https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1920&h=1080&fit=crop') center/cover no-repeat;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 120px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
`;

const HeroContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;

  @media (max-width: 968px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
`;

const MainTitle = styled(motion.h1)`
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 2rem;
  line-height: 1.1;
  text-align: center;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: clamp(2.5rem, 7vw, 3.5rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(2rem, 8vw, 2.8rem);
  }
`;

const HighlightedText = styled.span`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 700px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: clamp(1.1rem, 3.5vw, 1.4rem);
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: clamp(1rem, 4vw, 1.2rem);
  }
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  position: relative;
  z-index: 10;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
`;

interface HeroProps {
  cart?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    features?: string[];
    badge?: string;
    icon?: string;
    unit?: string;
  }>;
  setCart?: React.Dispatch<React.SetStateAction<Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    features?: string[];
    badge?: string;
    icon?: string;
    unit?: string;
  }>>>;
}

const Hero: React.FC<HeroProps> = ({ cart = [], setCart }) => {
  const navigate = useNavigate();

  const handleExploreProducts = () => {
    scrollToTop();
    navigate('/products');
  };

  return (
    <>
      <HeroSection id="hero">
        <HeroContainer>
          <HeroContent>
            <MainTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Pure <HighlightedText>Dairy</HighlightedText>, Straight<br />
              from the Farm to Your<br />
              Table.
            </MainTitle>
            
            <Subtitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience the pure taste of organic dairy products, no hormones, no antibiotics, 
              carefully sourced from our family farms and delivered fresh to your doorstep.
            </Subtitle>

            <CTAButton
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExploreProducts}
            >
              Explore Now
            </CTAButton>
          </HeroContent>
        </HeroContainer>
      </HeroSection>
      
      <FeaturedProducts cart={cart} setCart={setCart} />
    </>
  );
};

export default Hero; 