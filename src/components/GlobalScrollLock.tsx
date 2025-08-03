import { useEffect } from 'react';

interface GlobalScrollLockProps {
  isActive: boolean;
}

const GlobalScrollLock: React.FC<GlobalScrollLockProps> = ({ isActive }) => {
  useEffect(() => {
    const preventScroll = (e: Event) => {
      if (isActive) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    if (isActive) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      // Add event listeners
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('keydown', (e) => {
        if (isActive && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown' || e.key === 'Home' || e.key === 'End')) {
          e.preventDefault();
        }
      });
      
      return () => {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        
        // Remove event listeners
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
      };
    }
  }, [isActive]);

  return null;
};

export default GlobalScrollLock; 