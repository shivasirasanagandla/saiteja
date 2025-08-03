import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = styled.section`
  padding: 100px 0;
  background: white;
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

const TestimonialsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TestimonialCard = styled(motion.div)`
  background: var(--cream-50);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--cream-200);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const QuoteIcon = styled.div`
  position: absolute;
  top: -10px;
  left: 2rem;
  width: 40px;
  height: 40px;
  background: var(--primary-500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--primary-700);
  font-size: 1.2rem;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h4`
  font-weight: 600;
  color: var(--primary-700);
  margin-bottom: 0.25rem;
`;

const AuthorLocation = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--primary-500);
`;

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
              text: "The milk from Nature's Dairy is absolutely amazing! My kids love it and I can see the difference in their health. The cream layer is natural and the taste is incomparable to any other milk we've tried.",
      author: "Priya Sharma",
      location: "Gurgaon",
      rating: 5,
      avatar: "PS"
    },
    {
      id: 2,
      text: "As someone who's very particular about organic products, I'm impressed with their farming practices. The fact that they don't aggregate milk and deliver within 3 hours makes all the difference.",
      author: "Rajesh Kumar",
      location: "South Delhi",
      rating: 5,
      avatar: "RK"
    },
    {
      id: 3,
      text: "Their desi ghee is pure gold! Made using traditional methods, it has that authentic taste that reminds me of my grandmother's cooking. Worth every penny for the quality.",
      author: "Meera Patel",
      location: "Gurgaon",
      rating: 5,
      avatar: "MP"
    },
    {
      id: 4,
      text: "The fresh paneer is a game-changer for our family. It's so creamy and fresh, unlike the store-bought ones. My kids can't get enough of it in their meals.",
      author: "Amit Singh",
      location: "South Delhi",
      rating: 5,
      avatar: "AS"
    },
    {
      id: 5,
              text: "I love that they focus on indigenous cow breeds. The fresh milk quality is superior and I can feel the difference in my digestion. Highly recommend!",
      author: "Sunita Reddy",
      location: "Gurgaon",
      rating: 5,
      avatar: "SR"
    },
    {
      id: 6,
      text: "Their commitment to sustainable practices and ethical farming is commendable. The milk delivery is always on time and the glass bottles are a great eco-friendly touch.",
      author: "Vikram Malhotra",
      location: "South Delhi",
      rating: 5,
      avatar: "VM"
    }
  ];

  return (
    <TestimonialsSection id="testimonials">
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>What Our Customers Say</SectionTitle>
          <SectionSubtitle>
            Don't just take our word for it - hear from our happy customers about their experience
          </SectionSubtitle>
        </SectionHeader>

        <TestimonialsGrid
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <QuoteIcon>
                <Quote size={20} />
              </QuoteIcon>
              
              <TestimonialText>"{testimonial.text}"</TestimonialText>
              
              <TestimonialAuthor>
                <AuthorAvatar>{testimonial.avatar}</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{testimonial.author}</AuthorName>
                  <AuthorLocation>{testimonial.location}</AuthorLocation>
                </AuthorInfo>
                <Rating>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </Rating>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </Container>
    </TestimonialsSection>
  );
};

export default Testimonials; 