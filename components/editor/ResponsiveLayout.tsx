'use client';

import { useState, useEffect } from 'react';
import { ReactNode } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  breakpoint?: number;
}

export function ResponsiveLayout({ children, breakpoint = 1024 }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  if (isMobile) {
    // Mobile: Stack vertically, show tabs to switch between editor and preview
    return (
      <div className="h-full flex flex-col">
        {children}
      </div>
    );
  }

  if (isTablet) {
    // Tablet: Stack vertically with larger panels
    return (
      <div className="h-full flex flex-col">
        {children}
      </div>
    );
  }

  // Desktop: Side by side layout
  return (
    <div className="h-full flex flex-row">
      {children}
    </div>
  );
}
