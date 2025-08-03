import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User,
  Mic, MicOff, Volume2, VolumeX, Brain, AlertCircle, Heart, Star
} from 'lucide-react';

// Enhanced styled components with AI features
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
  background: linear-gradient(135deg, #f59e0b, #d97706);
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

  .ai-indicator {
    position: absolute;
    bottom: -5px;
    left: -5px;
    width: 16px;
    height: 16px;
    background: #10b981;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    color: white;
  }
`;

const ChatWindow = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 400px;
  height: 600px;
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

  .ai-features {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
`;

const FeatureButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: white;
  padding: 0.25rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
`;

const StyledMessage = styled(motion.div)<{ isUser: boolean; sentiment?: 'positive' | 'negative' | 'neutral' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ isUser: boolean; sentiment?: 'positive' | 'negative' | 'neutral' }>`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background: ${props => {
    if (props.isUser) return '#f59e0b';
    if (props.sentiment === 'positive') return '#dcfce7';
    if (props.sentiment === 'negative') return '#fef2f2';
    return '#f1f5f9';
  }};
  color: ${props => {
    if (props.isUser) return 'white';
    if (props.sentiment === 'positive') return '#166534';
    if (props.sentiment === 'negative') return '#dc2626';
    return '#1e293b';
  }};
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
  position: relative;

  .sentiment-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
  }
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
    transform: scale(1.05);
  }
`;

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
  background: white;
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

const ActionButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? '#f59e0b' : '#e2e8f0'};
  border: none;
  color: ${props => props.active ? 'white' : '#64748b'};
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.active ? '#d97706' : '#cbd5e1'};
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

const AIInsights = styled.div`
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem 0;
  border-left: 4px solid #f59e0b;
`;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickReplies?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  aiInsights?: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  user?: any;
}

const AIEnhancedChatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle, user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI-powered Nature's Dairy assistant. I can help you with products, orders, and even understand your mood! 🥛✨",
      isUser: false,
      timestamp: new Date(),
      quickReplies: ['Our Products', 'AI Recommendations', 'Voice Chat', 'Order Status']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [aiMode, setAiMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI-powered sentiment analysis
  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'happy', 'satisfied', 'perfect', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'poor', 'worst'];
    
    const words = text.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // AI-powered response generation with context
  const generateAIResponse = (userMessage: string, userContext?: any): { text: string; quickReplies?: string[]; insights?: string } => {
    const message = userMessage.toLowerCase();

    


    // Voice chat feature
    if (message.includes('voice') || message.includes('speak') || message.includes('talk')) {
      return {
        text: "🎤 **Voice Chat Activated!**\n\nI can now understand your voice! Click the microphone button to start speaking. I'll respond with both text and voice.\n\nTry saying: 'Tell me about your products' or 'What's the delivery time?'",
        quickReplies: ['Start Voice Chat', 'Text Only', 'Voice Settings'],
        insights: `User interested in voice features. Enabling voice interaction capabilities.`
      };
    }

    // Enhanced product inquiries with AI insights
    if (message.includes('product') || message.includes('milk') || message.includes('ghee') || message.includes('cheese') || message.includes('paneer') || message.includes('curd') || message.includes('butter') || message.includes('cream') || message.includes('lassi') || message.includes('shrikhand')) {
      const productInsights = generateProductInsights(message);
      return {
        text: `🥛 **Smart Product Analysis:**\n\n${productInsights}\n\n💡 **AI Insight:** Based on recent trends, fresh milk demand has increased by 25% this month!`,
        quickReplies: ['Order Now', 'Nutrition Facts', 'Compare Products', 'Subscription'],
        insights: `Product inquiry detected. Providing enhanced product information with market insights.`
      };
    }

    // Smart order tracking with AI predictions
    if (message.includes('order') || message.includes('status') || message.includes('track')) {
      const orderPrediction = generateOrderPrediction();
      return {
        text: `📦 **Smart Order Tracking:**\n\n${orderPrediction}\n\n🤖 **AI Prediction:** Your order will likely arrive within 2-3 hours based on current delivery patterns.`,
        quickReplies: ['Track Order', 'Delivery Updates', 'Contact Support'],
        insights: `Order tracking request. Providing predictive delivery information.`
      };
    }

    // Default AI response
    return {
      text: "🤖 **AI Assistant Mode:**\n\nI'm here to help with:\n• Voice chat capabilities\n• Predictive order tracking\n• Sentiment analysis\n• Product recommendations\n• Order assistance\n\nWhat would you like to explore?",
      quickReplies: ['AI Features', 'Voice Chat', 'Order Help', 'Help'],
      insights: `General inquiry. Providing AI feature overview.`
    };
  };



  const generateProductInsights = (query: string): string => {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('milk')) {
      return `**Fresh Milk** - ₹135\n• AI-analyzed freshness score: 98%\n• Customer satisfaction: 4.8/5\n• Health benefits: 15% more protein\n\n**Toned Milk** - ₹120\n• Low-fat option with high protein\n• Perfect for weight management\n• Same natural benefits, less fat\n\n**Full Cream Milk** - ₹150\n• Rich, creamy texture\n• Maximum nutrition retention\n• Ideal for children and athletes`;
    }
    
    if (queryLower.includes('ghee') || queryLower.includes('butter')) {
      return `**Organic Ghee** - ₹3000\n• Traditional Vedic method: 100%\n• Market demand trend: +30%\n• Quality assurance: AI-monitored\n\n**Butter** - ₹450\n• Pure cream butter\n• Rich flavor and texture\n• Perfect for cooking and spreading`;
    }
    
    if (queryLower.includes('paneer') || queryLower.includes('cheese')) {
      return `**Fresh Paneer** - ₹200\n• Freshness guarantee: 5 days\n• Customer preference: 95%\n• Traditional cottage cheese\n\n**Cheese** - ₹350\n• Artisanal aged cheese\n• Premium quality natural protein\n• Rich, complex flavors`;
    }
    
    if (queryLower.includes('curd') || queryLower.includes('dahi')) {
      return `**Curd (Dahi)** - ₹80\n• Rich in natural probiotics\n• Traditional fermentation\n• Perfect for digestion\n• Shelf life: 48 hours`;
    }
    
    if (queryLower.includes('lassi') || queryLower.includes('buttermilk')) {
      return `**Lassi** - ₹100\n• Refreshing yogurt drink\n• Natural flavors available\n• Perfect summer beverage\n\n**Buttermilk** - ₹60\n• Digestive health benefits\n• Traditional preparation\n• Low-calorie option`;
    }
    
    if (queryLower.includes('cream') || queryLower.includes('malai')) {
      return `**Cream** - ₹200\n• Rich, thick consistency\n• Perfect for desserts\n• Coffee enhancement\n\n**Malai** - ₹180\n• Fresh cream layer\n• Dessert and sweet making\n• Traditional Indian recipes`;
    }
    
    return `**Fresh Milk** - ₹135\n• AI-analyzed freshness score: 98%\n• Customer satisfaction: 4.8/5\n• Health benefits: 15% more protein\n\n**Organic Ghee** - ₹3000\n• Traditional method preservation: 100%\n• Market demand trend: +30%\n• Quality assurance: AI-monitored\n\n**Fresh Paneer** - ₹200\n• Freshness guarantee: 5 days\n• Customer preference: 95%\n• Traditional cottage cheese`;
  };

  const generateOrderPrediction = (): string => {
    return `**Current Status:** Processing\n**AI Estimated Delivery:** 2-3 hours\n**Route Optimization:** Active\n**Weather Impact:** Minimal\n**Traffic Analysis:** Optimal route selected`;
  };

  const addMessage = (text: string, isUser: boolean, quickReplies?: string[], insights?: string) => {
    const sentiment = isUser ? analyzeSentiment(text) : undefined;
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      quickReplies,
      sentiment,
      aiInsights: insights
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

    simulateTyping(() => {
      const response = generateAIResponse(userMessage, user);
      addMessage(response.text, false, response.quickReplies, response.insights);
    });
  };

  const handleQuickReply = (reply: string) => {
    addMessage(reply, true);
    simulateTyping(() => {
      const response = generateAIResponse(reply, user);
      addMessage(response.text, false, response.quickReplies, response.insights);
    });
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Here you would integrate with speech recognition API
    if (!isListening) {
      // Start listening
      console.log('Voice recognition started');
    } else {
      // Stop listening
      console.log('Voice recognition stopped');
    }
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
        <div className="ai-indicator">
          <Brain size={10} />
        </div>
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
                <h3>AI Dairy Assistant</h3>
                <div className="status">
                  <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></div>
                  AI Enhanced
                </div>
              </div>
              <div className="ai-features">
                <FeatureButton 
                  active={aiMode}
                  onClick={() => setAiMode(!aiMode)}
                  title="AI Mode"
                >
                  <Brain size={16} />
                </FeatureButton>
                <FeatureButton 
                  active={isListening}
                  onClick={handleVoiceToggle}
                  title="Voice Chat"
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </FeatureButton>
                <FeatureButton 
                  active={!isMuted}
                  onClick={() => setIsMuted(!isMuted)}
                  title="Voice Output"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </FeatureButton>
                <FeatureButton onClick={onToggle}>
                  <X size={16} />
                </FeatureButton>
              </div>
            </ChatHeader>

            <ChatBody>
              {messages.map((message) => (
                <StyledMessage key={message.id} isUser={message.isUser} sentiment={message.sentiment}>
                  {!message.isUser && (
                    <Avatar isUser={false}>
                      <Bot size={16} />
                    </Avatar>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <MessageBubble isUser={message.isUser} sentiment={message.sentiment}>
                      {message.text}
                      {message.sentiment && (
                        <div className="sentiment-indicator">
                          {message.sentiment === 'positive' ? <Heart size={10} /> : 
                           message.sentiment === 'negative' ? <AlertCircle size={10} /> : 
                           <Star size={10} />}
                        </div>
                      )}
                    </MessageBubble>
                    {message.aiInsights && (
                      <AIInsights>
                        <strong>🤖 AI Analysis:</strong> {message.aiInsights}
                      </AIInsights>
                    )}
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
                </StyledMessage>
              ))}

              {isTyping && (
                <StyledMessage isUser={false}>
                  <Avatar isUser={false}>
                    <Bot size={16} />
                  </Avatar>
                  <TypingIndicator>
                    <Brain size={16} />
                    AI is thinking...
                  </TypingIndicator>
                </StyledMessage>
              )}

              <div ref={messagesEndRef} />
            </ChatBody>

            <ChatInput>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything... (AI Enhanced)"
                disabled={isTyping}
              />
              <ActionButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={16} />
              </ActionButton>
            </ChatInput>
          </ChatWindow>
        )}
      </AnimatePresence>
    </ChatbotContainer>
  );
};

export default AIEnhancedChatbot; 