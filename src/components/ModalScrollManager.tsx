import { useEffect, useRef } from 'react';

interface ModalScrollManagerProps {
  isOpen: boolean;
}

const ModalScrollManager: React.FC<ModalScrollManagerProps> = ({ isOpen }) => {
  const scrollPosition = useRef(0);
  const originalStyles = useRef<{
    position: string;
    top: string;
    width: string;
    overflow: string;
    paddingRight: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
      
      // Store original body styles
      const body = document.body;
      originalStyles.current = {
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      };

      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Lock body scroll
      body.style.position = 'fixed';
      body.style.top = `-${scrollPosition.current}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Also lock html scroll for extra safety
      const html = document.documentElement;
      html.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        if (originalStyles.current) {
          body.style.position = originalStyles.current.position;
          body.style.top = originalStyles.current.top;
          body.style.width = originalStyles.current.width;
          body.style.overflow = originalStyles.current.overflow;
          body.style.paddingRight = originalStyles.current.paddingRight;
        } else {
          // Fallback cleanup
          body.style.position = '';
          body.style.top = '';
          body.style.width = '';
          body.style.overflow = '';
          body.style.paddingRight = '';
        }
        
        // Restore html scroll
        html.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition.current);
      };
    }
  }, [isOpen]);

  return null;
};

export default ModalScrollManager; 