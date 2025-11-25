import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-lg md:text-xl',
    medium: 'text-xl md:text-2xl',
    large: 'text-2xl md:text-3xl lg:text-4xl',
  };

  const iconSizes = {
    small: 'w-8 h-8 md:w-9 md:h-9',
    medium: 'w-10 h-10 md:w-12 md:h-12',
    large: 'w-12 h-12 md:w-14 md:h-14',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className} group cursor-pointer transition-transform hover:scale-105`}>
      <div className="relative">
        <img
          src="/assets/images/seroferologoart.png"
          alt="Sero-Fero Logo"
          className={`${iconSizes[size]} object-contain`}
        />
      </div>
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
