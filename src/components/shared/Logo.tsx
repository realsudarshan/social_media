import React from 'react'

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-lg md:text-xl',
    medium: 'text-xl md:text-2xl',
    large: 'text-2xl md:text-3xl lg:text-4xl'
  };

  const iconSizes = {
    small: 'w-8 h-8 md:w-9 md:h-9',
    medium: 'w-10 h-10 md:w-12 md:h-12',
    large: 'w-12 h-12 md:w-14 md:h-14'
  };

  const iconTextSizes = {
    small: 'text-sm md:text-base',
    medium: 'text-base md:text-lg',
    large: 'text-lg md:text-xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className} group cursor-pointer transition-transform hover:scale-105`}>
      <div className="relative">
        {/* Icon/Emblem */}
        <div className={`flex items-center justify-center ${iconSizes[size]} rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-500 shadow-lg shadow-primary-500/30 transition-all group-hover:shadow-primary-500/50`}>
          <span className={`text-white font-bold ${iconTextSizes[size]} tracking-tight`}>SF</span>
        </div>
        {/* Decorative accent */}
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-secondary-500 rounded-full animate-pulse"></div>
      </div>
      {/* Text */}
      <div className="flex flex-col">
        <span className={`font-bold ${sizeClasses[size]} text-light-1 tracking-tight leading-tight`}>
          Sero<span className="text-primary-500">-</span>Fero
        </span>
        <div className="h-0.5 w-full bg-gradient-to-r from-primary-500 via-primary-600 to-transparent mt-0.5 rounded-full"></div>
      </div>
    </div>
  );
};

export default Logo;

