import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

const FooterSection = styled.footer`
  background: var(--primary-800);
  color: white;
  padding: 60px 0 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterColumn = styled(motion.div)`
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--cream-100);
    margin-bottom: 1.5rem;
  }

  p {
    line-height: 1.7;
    color: var(--cream-200);
    margin-bottom: 1rem;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--cream-200);
`;

const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--primary-600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const ContactDetails = styled.div`
  h4 {
    font-weight: 600;
    color: var(--cream-100);
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  p {
    color: var(--cream-200);
    margin: 0;
    font-size: 0.9rem;
  }
`;

const QuickLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QuickLink = styled.a`
  color: var(--cream-200);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.95rem;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;

  &:hover {
    color: var(--cream-100);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialButton = styled.a`
  width: 45px;
  height: 45px;
  background: var(--primary-600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  outline: none;

  &:hover {
    background: var(--primary-500);
    transform: translateY(-2px);
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: var(--primary-700);
  color: white;
  font-size: 0.9rem;

  &::placeholder {
    color: var(--cream-300);
  }

  &:focus {
    outline: none;
    border: none;
  }
`;

const NewsletterButton = styled.button`
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: var(--primary-400);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--primary-600);
  padding-top: 2rem;
  text-align: center;
  color: var(--cream-300);
  font-size: 0.9rem;
`;

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    scrollToTop();
    navigate(path);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <FooterSection>
      <Container>
        <FooterContent>
          <FooterColumn
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>Nature's Dairy</h3>
            <p>
              Fresh, organic milk delivered directly from our farm to your doorstep. 
              Experience the pure taste of nature with our carefully nurtured cows and 
              sustainable farming practices.
            </p>
            <SocialLinks>
                              <SocialButton as="button" type="button" aria-label="Facebook">
                  <Facebook size={20} />
                </SocialButton>
                <SocialButton as="button" type="button" aria-label="Instagram">
                  <Instagram size={20} />
                </SocialButton>
                <SocialButton as="button" type="button" aria-label="Twitter">
                  <Twitter size={20} />
                </SocialButton>
                <SocialButton as="button" type="button" aria-label="YouTube">
                  <Youtube size={20} />
                </SocialButton>
            </SocialLinks>
          </FooterColumn>

          <FooterColumn
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3>Quick Links</h3>
            <QuickLinks>
              <QuickLink onClick={() => handleNavigation('/about')}>About Us</QuickLink>
              <QuickLink onClick={() => handleNavigation('/products')}>Our Products</QuickLink>
              <QuickLink onClick={() => handleNavigation('/practices')}>Farming Practices</QuickLink>
              <QuickLink onClick={() => handleNavigation('/contact')}>Contact Us</QuickLink>
            </QuickLinks>
          </FooterColumn>

          <FooterColumn
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3>Contact Info</h3>
            <ContactItem>
              <ContactIcon>
                <Phone size={16} />
              </ContactIcon>
              <ContactDetails>
                <h4>Phone</h4>
                <p>+91 9810649456</p>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <Mail size={16} />
              </ContactIcon>
              <ContactDetails>
                <h4>Email</h4>
                <p>info@naturesdairy.in</p>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <MapPin size={16} />
              </ContactIcon>
              <ContactDetails>
                <h4>Location</h4>
                <p>Baliawas Village, Gurgaon</p>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <Clock size={16} />
              </ContactIcon>
              <ContactDetails>
                <h4>Delivery</h4>
                <p>6:00 AM - 9:00 AM Daily</p>
              </ContactDetails>
            </ContactItem>
          </FooterColumn>

          <FooterColumn
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3>Newsletter</h3>
            <p>
              Subscribe to our newsletter for farm updates, health tips, and exclusive offers.
            </p>
            <NewsletterForm onSubmit={handleNewsletterSubmit}>
              <NewsletterInput
                type="email"
                placeholder="Enter your email"
                required
              />
              <NewsletterButton type="submit">
                Subscribe
              </NewsletterButton>
            </NewsletterForm>
          </FooterColumn>
        </FooterContent>

        <FooterBottom>
          <p>
            © 2024 Nature's Dairy. All rights reserved. | 
            Fresh Organic Milk from Farm to Table
          </p>
        </FooterBottom>
      </Container>
    </FooterSection>
  );
};

export default Footer; 