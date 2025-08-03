import React from 'react';
import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Info, Package, Leaf, MessageCircle, Settings, LogOut, UserCheck, Bell, Shield, HelpCircle } from 'lucide-react';
import AccountProfile from './AccountProfile';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
  border-bottom: 2px solid var(--cream-200);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  height: 80px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0.75rem 0;
    height: 70px;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0;
    height: 65px;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 0 15px;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
    gap: 1rem;
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

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;

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
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`;

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
    border: 2px solid var(--primary-600);
    
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
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #f59e0b;
    color: #f59e0b;
    transform: translateY(-1px);
  }
`;

interface HeaderProps {
  user: { type: 'email'|'mobile', value: string } | null;
  onLogout: () => void;
  cartCount?: number;
  onCartClick?: () => void;
  onLogin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, cartCount = 0, onCartClick, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [showAccountProfile, setShowAccountProfile] = React.useState(false);

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
      <HeaderContainer>
        <Nav>
          <Logo as={RouterNavLink} to="/">
            Nature's Dairy
          </Logo>
          <NavLinks isOpen={isMenuOpen}>
            <NavLink to="/about"> <Info size={16} /> About Us </NavLink>
            <NavLink to="/products"> <Package size={16} /> Our Products </NavLink>
            <NavLink to="/practices"> <Leaf size={16} /> Farming Practices </NavLink>
            <NavLink to="/contact"> <MessageCircle size={16} /> Contact Us </NavLink>
            {user && (
              <>
                <NavLink to="/orders"> <Package size={16} /> My Orders </NavLink>
              </>
            )}
          </NavLinks>
          <NavActions>
            <ActionButton onClick={onCartClick} title="View Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
            </ActionButton>
            {user ? (
              <div style={{ position: 'relative' }}>
                <SettingsButton onClick={toggleSettings} title="Settings">
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
                style={{ 
                  background: 'transparent', 
                  color: 'var(--primary-600)', 
                  border: '2px solid var(--primary-600)',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
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

export default Header; 