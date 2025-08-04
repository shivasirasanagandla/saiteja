import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Clock } from 'lucide-react';

const ChatbotContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f59e0b;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  }

  .notification {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    background: #dc2626;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
  }
`;

const ChatWindow = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    opacity: 0.9;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled(motion.div)<{ isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background: ${props => props.isUser ? '#f59e0b' : '#f1f5f9'};
  color: ${props => props.isUser ? 'white' : '#1e293b'};
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isUser ? '#f59e0b' : '#10b981'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  flex-shrink: 0;
`;

const QuickReplies = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const QuickReplyButton = styled.button`
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;

  &:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 0.9rem;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: #f59e0b;
  }
`;

const SendButton = styled.button`
  background: #f59e0b;
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #d97706;
    transform: scale(1.05);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  border-radius: 18px;
  max-width: 80%;
  font-size: 0.9rem;
  color: #64748b;
`;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickReplies?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Nature's Dairy assistant. How can I help you today? 🥛",
      isUser: false,
      timestamp: new Date(),
      quickReplies: ['Our Products', 'Delivery Info', 'Order Status', 'Contact Us']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isUser: boolean, quickReplies?: string[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      quickReplies
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, true);
    setInputValue('');

    // Process user message and generate response
    simulateTyping(() => {
      const response = generateResponse(userMessage);
      addMessage(response.text, false, response.quickReplies);
    });
  };

  const handleQuickReply = (reply: string) => {
    addMessage(reply, true);
    simulateTyping(() => {
      const response = generateResponse(reply);
      addMessage(response.text, false, response.quickReplies);
    });
  };

  const generateResponse = (userMessage: string): { text: string; quickReplies?: string[] } => {
    const message = userMessage.toLowerCase();

    // Product inquiries
    if (message.includes('product') || message.includes('milk') || message.includes('ghee') || message.includes('cheese')) {
      return {
        text: "We offer premium dairy products:\n\n🥛 **Fresh Milk** - ₹135\n- Pure, unprocessed with natural probiotics\n- Delivered within 3 hours\n\n🧈 **Organic Ghee** - ₹3000\n- Traditional Vedic method\n- Rich, nutty flavor\n\n🧀 **Cheese** - ₹200\n- Artisanal milk cheese\n- No preservatives\n\nWould you like to know more about any specific product?",
        quickReplies: ['Order Now', 'Delivery Areas', 'Pricing', 'Back to Products']
      };
    }

    // Delivery inquiries
    if (message.includes('delivery') || message.includes('deliver') || message.includes('location')) {
      return {
        text: "🚚 **Delivery Information:**\n\n📍 **Coverage Areas:**\n- Major Cities: Bangalore, Mumbai, Delhi NCR, Chennai, Hyderabad, Pune, Jaipur, Chandigarh\n- Other Cities: Coimbatore, Guntur, Kolkata, Lucknow, Mysore, Nashik, Surat, Vijayawada, Warangal\n\n⏰ **Delivery Time:**\n- 6:00 AM - 9:00 AM Daily\n- Within 3 hours of milking\n\n💰 **Free Delivery** on orders above ₹500",
        quickReplies: ['Check My Area', 'Order Now', 'Contact Support']
      };
    }

    // Order status
    if (message.includes('order') || message.includes('status') || message.includes('track')) {
      return {
        text: "📦 **Order Tracking:**\n\nTo check your order status:\n1. Login to your account\n2. Go to 'My Orders'\n3. Click on your order number\n\nFor immediate assistance, you can:\n📞 Call: +91 9810649456\n📧 Email: info@naturesdairy.in\n\nWould you like me to help you with anything else?",
        quickReplies: ['My Orders', 'Contact Support', 'New Order']
      };
    }

    // Contact information
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('call')) {
      return {
        text: "📞 **Contact Information:**\n\n📱 **Phone:** +91 9810649456\n📧 **Email:** info@naturesdairy.in\n📍 **Location:** Baliawas Village, Gurgaon\n⏰ **Support Hours:** 6:00 AM - 9:00 PM\n\nWe're here to help! What would you like to know?",
        quickReplies: ['Call Now', 'Send Email', 'Visit Farm', 'Back to Products']
      };
    }

    // Pricing
    if (message.includes('price') || message.includes('cost') || message.includes('₹') || message.includes('rupee')) {
      return {
        text: "💰 **Our Pricing:**\n\n🥛 **Fresh Milk:** ₹135 (₹150 MRP)\n🧈 **Organic Ghee:** ₹3000 (₹3500 MRP)\n🧀 **Cheese:** ₹200 (₹250 MRP)\n\n💡 **Special Offers:**\n- 15% discount on subscription\n- Free delivery on orders above ₹500\n- Bulk orders get additional discounts\n\nWould you like to place an order?",
        quickReplies: ['Order Now', 'Subscription Plans', 'Bulk Orders']
      };
    }

    // General greeting
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        text: "Hello! Welcome to Nature's Dairy! 🐄\n\nI'm here to help you with:\n• Product information and pricing\n• Delivery areas and timing\n• Order tracking and support\n• Contact information\n\nWhat would you like to know?",
        quickReplies: ['Our Products', 'Delivery Info', 'Contact Us', 'Order Now']
      };
    }

    // Default response
    return {
      text: "I'm not sure I understood that. Could you please:\n\n• Ask about our products (milk, ghee, cheese)\n• Inquire about delivery areas and timing\n• Check order status\n• Get contact information\n\nOr use the quick reply buttons below!",
      quickReplies: ['Our Products', 'Delivery Info', 'Contact Us', 'Help']
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatbotContainer>
      <ChatButton onClick={onToggle}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && messages.length === 1 && (
          <div className="notification">1</div>
        )}
      </ChatButton>

      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <ChatHeader>
              <div>
                <h3>Nature's Dairy Assistant</h3>
                <div className="status">
                  <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></div>
                  Online
                </div>
              </div>
              <CloseButton onClick={onToggle}>
                <X size={20} />
              </CloseButton>
            </ChatHeader>

            <ChatBody>
              {messages.map((message) => (
                <Message key={message.id} isUser={message.isUser}>
                  {!message.isUser && (
                    <Avatar isUser={false}>
                      <Bot size={16} />
                    </Avatar>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <MessageBubble isUser={message.isUser}>
                      {message.text}
                    </MessageBubble>
                    {message.quickReplies && (
                      <QuickReplies>
                        {message.quickReplies.map((reply, index) => (
                          <QuickReplyButton
                            key={index}
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply}
                          </QuickReplyButton>
                        ))}
                      </QuickReplies>
                    )}
                  </div>
                  {message.isUser && (
                    <Avatar isUser={true}>
                      <User size={16} />
                    </Avatar>
                  )}
                </Message>
              ))}

              {isTyping && (
                <Message isUser={false}>
                  <Avatar isUser={false}>
                    <Bot size={16} />
                  </Avatar>
                  <TypingIndicator>
                    <Clock size={16} />
                    Assistant is typing...
                  </TypingIndicator>
                </Message>
              )}

              <div ref={messagesEndRef} />
            </ChatBody>

            <ChatInput>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={16} />
              </SendButton>
            </ChatInput>
          </ChatWindow>
        )}
      </AnimatePresence>
    </ChatbotContainer>
  );
};

export default Chatbot; 