import React from 'react';

interface ClubLogoProps {
  className?: string;
  size?: number;
}

export const ClubLogo: React.FC<ClubLogoProps> = ({ className = '', size = 48 }) => {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-[#0d3b37] shadow-lg shadow-emerald-950/60 border border-emerald-400/30 p-1 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Shield Glow & Base */}
        <path
          d="M50 6 L86 20 V50 C86 73 50 94 50 94 C50 94 14 73 14 50 V20 L50 6 Z"
          fill="url(#shieldGrad)"
          stroke="#34d399"
          strokeWidth="2.5"
          filter="url(#glow)"
        />

        {/* Inner Gold Shield Border */}
        <path
          d="M50 12 L80 24 V49 C80 68 50 86 50 86 C50 86 20 68 20 49 V24 L50 12 Z"
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeDasharray="2 1"
          opacity="0.8"
        />

        {/* Crossed Cricket Bats */}
        <g stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round">
          <line x1="28" y1="28" x2="72" y2="72" />
          <line x1="72" y1="28" x2="28" y2="72" />
        </g>

        {/* Cricket Wicket (Stumps & Bails) */}
        <rect x="43" y="38" width="3" height="28" rx="1.5" fill="#fef08a" />
        <rect x="48.5" y="38" width="3" height="28" rx="1.5" fill="#fef08a" />
        <rect x="54" y="38" width="3" height="28" rx="1.5" fill="#fef08a" />
        <rect x="41" y="35" width="18" height="2.5" rx="1.2" fill="#fbbf24" />

        {/* Radiant Red Cricket Ball with Seam */}
        <circle cx="50" cy="52" r="10" fill="url(#ballGrad)" stroke="#f43f5e" strokeWidth="1" />
        <path
          d="M44 49 C46 52 54 52 56 49"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="1.5 1"
          fill="none"
        />
        <path
          d="M44 55 C46 52 54 52 56 55"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="1.5 1"
          fill="none"
        />

        {/* Somnath Sovereign Star */}
        <path
          d="M50 17 L52 22 L57 22 L53 25 L55 30 L50 27 L45 30 L47 25 L43 22 L48 22 Z"
          fill="#fbbf24"
        />

        <defs>
          <linearGradient id="shieldGrad" x1="14" y1="6" x2="86" y2="94" gradientUnits="userSpaceOnUse">
            <stop stopColor="#064e3b" />
            <stop offset="0.5" stopColor="#0f766e" />
            <stop offset="1" stopColor="#042f2e" />
          </linearGradient>
          <radialGradient id="ballGrad" cx="0.3" cy="0.3" r="0.8">
            <stop stopColor="#fb7185" />
            <stop offset="0.6" stopColor="#e11d48" />
            <stop offset="1" stopColor="#881337" />
          </radialGradient>
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#047857" floodOpacity="0.4" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
