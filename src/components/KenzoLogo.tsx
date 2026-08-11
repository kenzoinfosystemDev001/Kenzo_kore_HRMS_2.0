import React from 'react';

interface KenzoLogoProps {
  className?: string;
  size?: number;
}

export const KenzoLogo: React.FC<KenzoLogoProps> = ({ className = 'w-8 h-8', size }) => {
  return (
    <svg 
      viewBox="0 0 300 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <path 
        d="M 120 100 C 100 65, 55 65, 55 100 C 55 135, 100 135, 130 100 L 230 25 C 250 15, 265 25, 255 45 L 155 125 C 180 150, 220 170, 255 160 C 240 185, 195 180, 140 140 Z" 
        fill="#007bff"
      />
      <path 
        d="M 150 130 C 175 155, 215 175, 255 160 C 235 185, 185 180, 135 140 Z" 
        fill="#0056b3"
      />
    </svg>
  );
};
