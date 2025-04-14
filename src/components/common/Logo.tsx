
import React from 'react';
import { cn } from '@/lib/utils';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className }) => {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/lovable-uploads/13185240-d1b7-411e-94a9-2d83dd38b7fb.png" 
        alt="Smart Pockets Logo" 
        className={cn(dimensions[size], "object-contain")}
      />
      {showText && (
        <div className={cn(
          `font-bold leading-none font-['Poppins',_sans-serif] text-primary-500`,
          textSizes[size]
        )}>
          <div>Smart</div>
          <div>Pockets</div>
        </div>
      )}
    </div>
  );
};

export default Logo;
