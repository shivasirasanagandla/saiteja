import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const ContactSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled(motion.div)`
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #64748b;
    margin-bottom: 2rem;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  p {
    color: #64748b;
    margin: 0;
  }
`;

const ContactForm = styled(motion.form)`
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-color: #3b82f6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-color: #3b82f6;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
  }
`;

const LiveChatWidget = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatWindow = styled(motion.div)`
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatBody = styled.div`
  height: 400px;
  padding: 1rem;
  overflow-y: auto;
`;

const ChatMessage = styled.div<{ isUser: boolean }>`
  margin-bottom: 1rem;
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  background: ${props => props.isUser ? '#f59e0b' : '#f1f5f9'};
  color: ${props => props.isUser ? 'white' : '#1e293b'};
  padding: 0.75rem 1rem;
  border-radius: 18px;
  max-width: 80%;
  font-size: 0.875rem;
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
`;

const ChatInputField = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #f59e0b;
  }
`;



const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    deliveryTime: ''
  });
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
            { text: 'Hi! Welcome to Nature\'s Dairy. How can I help you today?', isUser: false }
  ]);
  const [chatInput, setChatInput] = useState('');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '', deliveryTime: '' });
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { text: chatInput, isUser: true }]);
      setChatInput('');
      
      // Simulate bot response
      setTimeout(() => {
        const responses = [
          'Thank you for your message! Our team will assist you shortly.',
          'Great question! Let me connect you with our dairy expert.',
          'I understand your concern. Let me check our delivery schedule for you.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
      }, 1000);
    }
  };



  return (
    <ContactSection id="contact">
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Get in Touch</SectionTitle>
          <SectionSubtitle>
            Ready to experience the goodness of pure fresh milk? Contact us to place an order, 
            schedule a farm visit, or try our free sample. We're here to help!
          </SectionSubtitle>
        </SectionHeader>

        <ContactContent>
          <ContactInfo
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>Contact Information</h3>
            <p>
              We would be delighted to welcome you to the farm to meet our cows and understand 
              our farming practices. Reach out to us anytime!
            </p>

            <ContactItem>
              <ContactIcon>
                <Phone size={20} />
              </ContactIcon>
              <ContactDetails>
                <h4>Phone</h4>
                <p>+91 9810649456 / 9667035805</p>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <Mail size={20} />
              </ContactIcon>
              <ContactDetails>
                <h4>Email</h4>
                <p>info@naturesdairy.in</p>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <MapPin size={20} />
              </ContactIcon>
              <ContactDetails>
                <h4>Farm Location</h4>
                <p>Baliawas Village, Near Gwal Pahari<br />Gurgaon 122002</p>
              </ContactDetails>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <Clock size={20} />
              </ContactIcon>
              <ContactDetails>
                <h4>Delivery Hours</h4>
                <p>Daily: 6:00 AM - 9:00 AM<br />Within 3 hours of milking</p>
              </ContactDetails>
            </ContactItem>
          </ContactInfo>

          <ContactForm
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
          >
            <FormTitle>Send us a Message</FormTitle>
            
            <FormGroup>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Message *</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your requirements or ask any questions..."
                required
              />
            </FormGroup>

            <SubmitButton type="submit">
              <Send size={16} />
              Send Message
            </SubmitButton>
          </ContactForm>
        </ContactContent>



        <LiveChatWidget>
          <ChatButton onClick={() => setShowChat(!showChat)}>
            <MessageCircle size={24} />
          </ChatButton>
        </LiveChatWidget>

        <AnimatePresence>
          {showChat && (
            <ChatWindow
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              <ChatHeader>
                <div>
                  <div style={{ fontWeight: '600' }}>Nature's Dairy</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Online Support</div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  ×
                </button>
              </ChatHeader>
              <ChatBody>
                {chatMessages.map((message, index) => (
                  <ChatMessage key={index} isUser={message.isUser}>
                    <MessageBubble isUser={message.isUser}>
                      {message.text}
                    </MessageBubble>
                  </ChatMessage>
                ))}
              </ChatBody>
              <ChatInput>
                <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <ChatInputField
                    type="text"
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#f59e0b',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </ChatInput>
            </ChatWindow>
          )}
        </AnimatePresence>
      </Container>
    </ContactSection>
  );
};

export default Contact; 