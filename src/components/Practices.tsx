import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Sun, Truck } from 'lucide-react';

const PracticesSection = styled.section`
  padding: 100px 0;
  background: var(--cream-50);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--primary-800);
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PracticesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const PracticeCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const PracticeIcon = styled.div`
  width: 60px;
  height: 60px;
  background: var(--green-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--green-600);
`;

const PracticeTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--primary-700);
  margin-bottom: 1rem;
`;

const PracticeDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PracticeFeatures = styled.ul`
  list-style: none;
  margin-top: 1rem;
`;

const PracticeFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;

  &::before {
    content: "✓";
    color: var(--green-500);
    font-weight: bold;
  }
`;

const Practices: React.FC = () => {
  const practices = [
    {
      id: 1,
      title: "We Don't Aggregate",
              description: "At Nature's Dairy, you get milk and milk products that are produced only from our own cows.",
      icon: <Leaf size={24} />,
      features: [
        "Complete control over quality",
        "No antibiotics or hormones",
        "Pesticide-free feed only",
        "Traceable from farm to table"
      ]
    },
    {
      id: 2,
      title: "Indigenous Breed Development",
      description: "We believe in the propagation of indigenous cow breeds for superior milk quality.",
      icon: <Sun size={24} />,
      features: [
        "Gir/Sahiwal breeds",
        "Superior natural protein content",
        "Natural disease resistance",
        "Traditional breeding methods"
      ]
    },
    {
      id: 3,
      title: "Environmentally Responsible",
      description: "We deliver local, in a limited radius, ensuring a supply chain with low carbon footprint.",
      icon: <Recycle size={24} />,
      features: [
        "3-hour delivery window",
        "Glass bottle recycling",
        "Waste water composting",
        "Solar-powered operations"
      ]
    },
    {
      id: 4,
      title: "Fresh & Unprocessed",
      description: "You get milk which is unprocessed, whole, and living - with all of its probiotic bacteria.",
      icon: <Truck size={24} />,
      features: [
        "No pasteurization",
        "No homogenization",
        "Probiotic bacteria preserved",
        "Natural cream layer"
      ]
    }
  ];

  return (
    <PracticesSection id="practices">
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Sustainable Farming Practices</SectionTitle>
          <SectionSubtitle>
            Our commitment to ethical and sustainable practices ensures the highest quality dairy products
          </SectionSubtitle>
        </SectionHeader>

        <PracticesGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {practices.map((practice, index) => (
            <PracticeCard
              key={practice.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PracticeIcon>
                {practice.icon}
              </PracticeIcon>
              
              <PracticeTitle>{practice.title}</PracticeTitle>
              <PracticeDescription>{practice.description}</PracticeDescription>
              
              <PracticeFeatures>
                {practice.features.map((feature, idx) => (
                  <PracticeFeature key={idx}>{feature}</PracticeFeature>
                ))}
              </PracticeFeatures>
            </PracticeCard>
          ))}
        </PracticesGrid>
      </Container>
    </PracticesSection>
  );
};

export default Practices; 