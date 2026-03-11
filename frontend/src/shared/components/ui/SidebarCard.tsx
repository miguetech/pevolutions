import React, { useState, useEffect } from 'react';

interface SidebarCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
}

const SidebarCard: React.FC<SidebarCardProps> = ({ 
  title, 
  children, 
  icon,
  defaultExpanded = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Also listen for Astro navigation to reset state if needed
    document.addEventListener('astro:after-navigation', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('astro:after-navigation', checkMobile);
    };
  }, []);

  // On desktop, it's always open
  const shouldBeOpen = !isMobile || isOpen;

  return (
    <div className="glass-card overflow-hidden transition-all duration-300">
      <button 
        onClick={() => isMobile && setIsOpen(!isOpen)}
        className={`w-full p-6 flex items-center justify-between text-left focus:outline-none ${isMobile ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-brand-accent">{icon}</div>}
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
        </div>
        
        {/* Toggle Icon - Only Visible on Mobile */}
        <div className={`lg:hidden transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div 
        className={`transition-all duration-300 bg-brand-bg/20 ${
          shouldBeOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-6 pb-6 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarCard;
