import React from 'react';

export const BioumiLogo: React.FC<{ className?: string, showText?: boolean }> = ({ className = "w-32 h-32", showText = true }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Circle Border */}
    <circle cx="100" cy="100" r="96" stroke="#4d7c0f" strokeWidth="3" />
    
    {/* Decorative Diamonds */}
    <path d="M165 70 L175 80 L165 90 L155 80 Z" fill="#fcfbe8" stroke="#eaddd7" />
    <path d="M35 120 L45 130 L35 140 L25 130 Z" fill="#fcfbe8" stroke="#eaddd7" />

    {/* Basket */}
    <path d="M75 50 Q100 10 125 50" stroke="#eab308" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M65 60 L135 60 L125 95 Q100 105 75 95 Z" fill="#eab308" />
    <path d="M70 60 L80 95" stroke="#fff" strokeWidth="2" opacity="0.5" />
    <path d="M85 60 L95 98" stroke="#fff" strokeWidth="2" opacity="0.5" />
    <path d="M100 60 L110 98" stroke="#fff" strokeWidth="2" opacity="0.5" />
    <path d="M115 60 L125 95" stroke="#fff" strokeWidth="2" opacity="0.5" />

    {/* Leaves */}
    <g transform="translate(45, 40) rotate(-10)">
      <path d="M20 50 Q10 20 20 5 Q30 20 20 50" fill="#4d7c0f" />
      <path d="M20 50 Q5 35 10 20 Q25 35 20 50" fill="#4d7c0f" />
      <path d="M20 60 L20 10" stroke="#365314" strokeWidth="1.5" />
    </g>

    {/* Text */}
    <text x="100" y="135" textAnchor="middle" fontFamily="serif" fontSize="38" fontWeight="bold" fill="#365314" style={{ filter: 'drop-shadow(0px 1px 0px rgba(255,255,255,0.5))' }}>Bi’oumi</text>
    <text x="100" y="168" textAnchor="middle" fontFamily="serif" fontSize="38" fontWeight="bold" fill="#365314" style={{ filter: 'drop-shadow(0px 1px 0px rgba(255,255,255,0.5))' }}>Box</text>
    
    {/* Arabic Text */}
    <text x="100" y="188" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="#d97706">على خاطر صحتك</text>
  </svg>
);

export default BioumiLogo;