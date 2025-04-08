
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
      <div className="relative">
        <div className={`${dimensions[size]} relative`}>
          <div className="absolute top-0 w-full aspect-square bg-secondary rounded-full flex items-center justify-center border-2 border-dark">
            <span className="text-dark font-bold text-xl">$</span>
          </div>
          <div className="absolute top-1/2 w-full aspect-[1/1.2] bg-primary rounded-b-lg border-2 border-dark flex items-center justify-center">
            <div className="w-4/5 h-0.5 bg-dark opacity-70 absolute top-1/4 rounded-full"></div>
          </div>
        </div>
      </div>
      {showText && (
        <div className={`font-bold text-dark ${textSizes[size]} leading-none`}>
          <div>Smart</div>
          <div>Pockets</div>
        </div>
      )}
    </div>
  );
};

export default Logo;
