import React from 'react';
import { SectionId } from '../types/presentation';

interface GeometricBackdropProps {
  section: SectionId;
}

export const GeometricBackdrop: React.FC<GeometricBackdropProps> = ({ section }) => {
  const accentMap: Record<SectionId, { primary: string; secondary: string }> = {
    welcome: { primary: '#4FD1A5', secondary: '#FFD95A' },
    xo: { primary: '#FF6B6B', secondary: '#4FD1A5' },
    'quick-questions': { primary: '#FFD95A', secondary: '#5B9BD5' },
    headphone: { primary: '#5B9BD5', secondary: '#4FD1A5' },
    bonus: { primary: '#FF6B6B', secondary: '#FFD95A' },
    winners: { primary: '#4FD1A5', secondary: '#FF6B6B' },
    'thank-you': { primary: '#FFD95A', secondary: '#4FD1A5' },
  };

  const colors = accentMap[section];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {/* Top-right soft organic circle */}
      <svg
        className="absolute -top-24 -right-24 w-72 h-72 opacity-30 transition-transform duration-500"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="90" fill={colors.primary} />
      </svg>

      {/* Bottom-left rounded geometric block */}
      <svg
        className="absolute -bottom-24 -left-20 w-80 h-80 opacity-25 transition-transform duration-500"
        viewBox="0 0 240 240"
        fill="none"
      >
        <rect
          x="20"
          y="20"
          width="180"
          height="180"
          rx="48"
          transform="rotate(-14 110 110)"
          fill={colors.secondary}
        />
      </svg>

      {/* Subtle top-left playful squiggle */}
      <svg
        className="absolute top-20 left-10 w-28 h-12 opacity-35 hidden md:block"
        viewBox="0 0 120 40"
        fill="none"
      >
        <path
          d="M6 24C18 8 30 8 42 24C54 40 66 40 78 24C90 8 102 8 114 24"
          stroke="#5B9BD5"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      {/* Subtle bottom-right ring & triangle */}
      <svg
        className="absolute bottom-20 right-12 w-24 h-24 opacity-30 hidden md:block"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="62" cy="58" r="22" stroke="#FF6B6B" strokeWidth="6" />
        <path d="M22 36L38 14L50 38Z" fill="#4FD1A5" />
      </svg>
    </div>
  );
};
