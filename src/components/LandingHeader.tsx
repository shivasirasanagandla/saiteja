import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Info, 
  Package, 
  Leaf, 
  MessageCircle, 
  Settings, 
  LogOut, 
  UserCheck, 
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Truck,
  Heart
} from 'lucide-react';
import AccountProfile from './AccountProfile';
import { scrollToTop } from '../utils/scrollToTop';

const HeaderContainer = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  z-index: 1000;
  padding: ${props => props.scrolled ? '0.75rem 0' : '1rem 0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: ${props => props.scrolled ? '2px solid var(--cream-200)' : 'none'};
  box-shadow: ${props => props.scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
  height: ${props => props.scrolled ? 'var(--header-height-scrolled)' : 'var(--header-height)'};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: ${props => props.scrolled ? '0.5rem 0' : '0.75rem 0'};
    height: ${props => props.scrolled ? '60px' : '70px'};
  }

  @media (max-width: 480px) {
    padding: ${props => props.scrolled ? '0.4rem 0' : '0.5rem 0'};
    height: ${props => props.scrolled ? '55px' : '65px'};
  }
`;

const TopBar = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.5rem 0;
  font-size: 0.8rem;
  text-align: center;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.4rem 0;
  }
`;

const TopBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 15px;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const TopBarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const TopBarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.9;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const TopBarButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const Logo = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-600);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--primary-500);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
    padding: 0.2rem 0.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0.2rem 0.4rem;
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 0.9rem;
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  justify-content: center;
  flex: 1;
  margin: 0 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-top: 2px solid var(--cream-200);
    max-height: calc(100vh - 100%);
    overflow-y: auto;
    margin: 0;
    flex: none;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`;

// Custom NavLink component with scroll-to-top functionality
const CustomNavLink: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({ to, children, className }) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTop();
    navigate(to);
  };

  return (
    <NavLink to={to} onClick={handleClick} className={className}>
      {children}
    </NavLink>
  );
};

const NavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.6rem 1rem;
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  
  &.active {
    color: var(--primary-600);
    background: var(--primary-50);
    box-shadow: 0 2px 8px rgba(234, 179, 8, 0.2);
  }
  
  &:hover {
    color: var(--primary-600);
    background: var(--cream-100);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    width: 100%;
    justify-content: center;
    border-radius: 12px;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: var(--primary-600);
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--primary-500);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
  }

  &.secondary {
    background: transparent;
    color: var(--primary-600);
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    
    &:hover {
      background: var(--primary-600);
      color: white;
    }
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--primary-500);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 50%;
  min-width: 20px;
  text-align: center;
  border: 2px solid white;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: var(--primary-600);
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-500);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SettingsDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  margin-top: 0.5rem;
`;

const SettingsItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #1e293b;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border-radius: 0;

  &:hover {
    background: #f8fafc;
    color: #f59e0b;
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
    border-top: 1px solid #e2e8f0;
    color: #dc2626;
  }

  &:last-child:hover {
    background: #fef2f2;
    color: #dc2626;
  }
`;

const SettingsButton = styled.button`
  position: relative;
  background: var(--primary-600);
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--primary-500);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.3);
  }
`;

interface LandingHeaderProps {
  user: { type: 'email'|'mobile', value: string } | null;
  onLogout: () => void;
  cartCount?: number;
  onCartClick?: () => void;
  onLogin?: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ 
  user, 
  onLogout, 
  cartCount = 0, 
  onCartClick, 
  onLogin 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAccountProfile, setShowAccountProfile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleSettingsClick = (action: string) => {
    setIsSettingsOpen(false);
    switch (action) {
      case 'account':
        setShowAccountProfile(true);
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <TopBar>
        <TopBarContent>
          <TopBarInfo>
            <TopBarItem>
              <Phone size={14} />
              +91 98765 43210
            </TopBarItem>
            <TopBarItem>
              <Mail size={14} />
              info@naturesdairy.com
            </TopBarItem>
            <TopBarItem>
              <Clock size={14} />
              Mon-Sat: 6AM-8PM
            </TopBarItem>
          </TopBarInfo>
          <TopBarActions>
            <TopBarButton>
              <Truck size={12} />
              Free Delivery
            </TopBarButton>
            <TopBarButton>
              <Star size={12} />
              4.9/5 Rating
            </TopBarButton>
          </TopBarActions>
        </TopBarContent>
      </TopBar>
      
      <HeaderContainer scrolled={scrolled}>
        <Nav>
          <Logo as={RouterNavLink} to="/" onClick={() => scrollToTop()}>
            <LogoIcon>ND</LogoIcon>
            Nature's Dairy
          </Logo>
          
          <NavLinks isOpen={isMenuOpen}>
            <CustomNavLink to="/about">
              <Info size={16} />
              About Us
            </CustomNavLink>
            <CustomNavLink to="/products">
              <Package size={16} />
              Our Products
            </CustomNavLink>
            <CustomNavLink to="/practices">
              <Leaf size={16} />
              Farming Practices
            </CustomNavLink>
            <CustomNavLink to="/contact">
              <MessageCircle size={16} />
              Contact Us
            </CustomNavLink>
            {user && (
              <CustomNavLink to="/orders">
                <Package size={16} />
                My Orders
              </CustomNavLink>
            )}
          </NavLinks>
          
          <NavActions>
            <ActionButton onClick={onCartClick} title="View Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
            </ActionButton>
            
            {user ? (
              <div style={{ position: 'relative' }}>
                <SettingsButton onClick={toggleSettings} title="User Settings">
                  <Settings size={20} />
                </SettingsButton>
                <SettingsDropdown isOpen={isSettingsOpen}>
                  <SettingsItem onClick={() => handleSettingsClick('account')}>
                    <UserCheck size={16} />
                    My Account
                  </SettingsItem>
                  <SettingsItem onClick={() => handleSettingsClick('logout')}>
                    <LogOut size={16} />
                    Logout
                  </SettingsItem>
                </SettingsDropdown>
              </div>
            ) : (
              <ActionButton 
                onClick={onLogin} 
                title="Login"
                className="secondary"
              >
                <User size={16} style={{ marginRight: '0.5rem' }} />
                Login
              </ActionButton>
            )}
            
            <MobileMenuButton onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MobileMenuButton>
          </NavActions>
        </Nav>
      </HeaderContainer>
      
      {showAccountProfile && (
        <AccountProfile 
          user={user} 
          onClose={() => setShowAccountProfile(false)} 
        />
      )}
    </>
  );
};

export default LandingHeader; 