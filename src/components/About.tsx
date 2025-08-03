import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Award, Beef, Building2 } from 'lucide-react';

const AboutSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const StoryContent = styled(motion.div)`
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #64748b;
    margin-bottom: 1.5rem;
  }
`;

const InteractiveTimeline = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const TimelineItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${props => props.active ? '#fef3c7' : '#f8fafc'};
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid ${props => props.active ? '#f59e0b' : '#e2e8f0'};

  &:hover {
    background: #fef3c7;
    border-left-color: #f59e0b;
  }
`;

const TimelineYear = styled.div`
  font-weight: 700;
  color: #f59e0b;
  font-size: 1.2rem;
  min-width: 60px;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const TimelineDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const FarmStats = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #f59e0b;
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-weight: 500;
`;

const VirtualTour = styled(motion.div)`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 24px;
  padding: 2rem;
  margin-top: 3rem;
  text-align: center;
`;

const TourButton = styled.button`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
  }
`;

const TourModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const TourStep = styled.div<{ active: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: ${props => props.active ? '#fef3c7' : '#f8fafc'};
  border-left: 4px solid ${props => props.active ? '#f59e0b' : '#e2e8f0'};
`;

const About: React.FC = () => {
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const timelineData = [
    {
      year: '2018',
      title: 'The Beginning',
      description: 'Started with 5 indigenous Gir cows on our family farm'
    },
    {
      year: '2019',
      title: 'First Customers',
              description: 'Delivered our first fresh milk to 50 families in Gurgaon'
    },
    {
      year: '2020',
      title: 'Expansion',
      description: 'Grew to 25 cows and expanded delivery to South Delhi'
    },
    {
      year: '2021',
      title: 'Product Range',
      description: 'Added Desi Ghee and Fresh Paneer to our offerings'
    },
    {
      year: '2022',
      title: 'Recognition',
      description: 'Received Organic Certification and multiple awards'
    },
    {
      year: '2023',
      title: 'Today',
      description: 'Serving 500+ families with 50+ indigenous cows'
    }
  ];

  const tourSteps = [
    {
      title: 'Welcome to Our Farm',
      description: 'Located in the serene Aravalis, our farm spans 15 acres of organic land.',
      icon: '🏞️'
    },
    {
      title: 'Meet Our Cows',
      description: 'Our 50+ indigenous Gir and Sahiwal cows roam freely in open pastures.',
      icon: '🐄'
    },
    {
      title: 'Organic Feeding',
      description: 'We grow pesticide-free fodder and provide natural mineral supplements.',
      icon: '🌱'
    },
    {
      title: 'Milking Process',
      description: 'Twice daily milking with traditional methods, no machines or stress.',
      icon: '🥛'
    },
    {
      title: 'Quality Control',
      description: 'Every batch is tested for purity before delivery to your doorstep.',
      icon: '✅'
    }
  ];

  return (
    <AboutSection id="about">
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Our Story</SectionTitle>
          <SectionSubtitle>
            From corporate life to sustainable farming - discover how we're bringing 
            pure fresh milk back to Indian families through ethical and traditional practices.
          </SectionSubtitle>
        </SectionHeader>

        <AboutContent>
          <StoryContent
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>The Farmer's Journey</h3>
            <p>
              Our founder left a successful corporate career to return to his roots in farming. 
              Frustrated with the lack of pure, unprocessed milk in the market, he decided to 
              create a dairy that prioritizes animal welfare, environmental sustainability, and 
              product purity.
            </p>
            <p>
              Today, our farm is home to 50+ indigenous Gir and Sahiwal cows, each treated 
              like family. We believe that happy cows produce the best milk, which is why we 
              never separate calves from their mothers and allow our cows to roam freely in 
              our organic pastures.
            </p>
            <p>
              Every morning, our fresh milk is delivered to your doorstep within 3 hours 
              of milking, ensuring you get the purest, most nutritious milk possible - just 
              like our grandparents used to drink.
            </p>
          </StoryContent>

          <InteractiveTimeline
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Our Journey</h3>
            {timelineData.map((item, index) => (
              <TimelineItem
                key={index}
                active={activeTimelineItem === index}
                onClick={() => setActiveTimelineItem(index)}
              >
                <TimelineYear>{item.year}</TimelineYear>
                <TimelineContent>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineDescription>{item.description}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </InteractiveTimeline>
        </AboutContent>

        <FarmStats
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <StatIcon>
              <Beef size={24} />
            </StatIcon>
            <StatValue>50+</StatValue>
            <StatLabel>Indigenous Cows</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <StatIcon>
              <Users size={24} />
            </StatIcon>
            <StatValue>500+</StatValue>
            <StatLabel>Happy Families</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <StatIcon>
              <Clock size={24} />
            </StatIcon>
            <StatValue>3h</StatValue>
            <StatLabel>Delivery Window</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <StatIcon>
              <Award size={24} />
            </StatIcon>
            <StatValue>5+</StatValue>
            <StatLabel>Years of Excellence</StatLabel>
          </StatCard>
        </FarmStats>

        <VirtualTour
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Take a Virtual Farm Tour</h3>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            Experience our farm from the comfort of your home. See how we care for our cows 
            and produce the purest fresh milk using traditional methods.
          </p>
          <TourButton onClick={() => setShowTour(true)}>
            <Building2 size={20} />
            Start Virtual Tour
          </TourButton>
        </VirtualTour>

        <AnimatePresence>
          {showTour && (
            <TourModal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTour(false)}
            >
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ color: '#1e293b' }}>Virtual Farm Tour</h3>
                  <button 
                    onClick={() => setShowTour(false)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '1.5rem', 
                      cursor: 'pointer',
                      color: '#64748b'
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {tourSteps[tourStep].icon}
                  </div>
                  <h4 style={{ color: '#1e293b', marginBottom: '1rem' }}>
                    {tourSteps[tourStep].title}
                  </h4>
                  <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                    {tourSteps[tourStep].description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setTourStep(Math.max(0, tourStep - 1))}
                    disabled={tourStep === 0}
                    style={{
                      background: tourStep === 0 ? '#e2e8f0' : '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: tourStep === 0 ? 'not-allowed' : 'pointer',
                      opacity: tourStep === 0 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>

                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {tourStep + 1} of {tourSteps.length}
                  </div>

                  <button
                    onClick={() => {
                      if (tourStep === tourSteps.length - 1) {
                        setShowTour(false);
                        setTourStep(0);
                      } else {
                        setTourStep(tourStep + 1);
                      }
                    }}
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {tourStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}
                  </button>
                </div>
              </ModalContent>
            </TourModal>
          )}
        </AnimatePresence>
      </Container>
    </AboutSection>
  );
};

export default About; 