import React from 'react';

interface JoinLogoProps {
  className?: string;
  variant?: 'horizontal' | 'compact' | 'badge';
  showSubtitle?: boolean;
}

export const JoinLogo: React.FC<JoinLogoProps> = ({
  className = '',
  variant = 'horizontal',
  showSubtitle = true
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Robot Badge */}
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c1c38] to-[#162a52] border border-cyan-400/40 p-1 flex items-center justify-center shadow-md shadow-cyan-500/20">
          <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Robot Antenna */}
            <circle cx="50" cy="14" r="5" fill="#38bdf8" />
            <line x1="50" y1="19" x2="50" y2="28" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            {/* Ears */}
            <rect x="18" y="38" width="6" height="14" rx="3" fill="#0284c7" />
            <rect x="76" y="38" width="6" height="14" rx="3" fill="#0284c7" />
            {/* Robot Head */}
            <rect x="22" y="26" width="56" height="42" rx="14" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2.5" />
            {/* Visor */}
            <rect x="28" y="34" width="44" height="24" rx="8" fill="#0c1b33" />
            {/* Happy Eyes */}
            <ellipse cx="40" cy="45" rx="5" ry="6" fill="#38bdf8" />
            <ellipse cx="60" cy="45" rx="5" ry="6" fill="#38bdf8" />
            <path d="M46 51 Q50 54 54 51" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Body */}
            <path d="M36 70 L34 88 Q34 92 40 92 L60 92 Q66 92 66 88 L64 70 Z" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
            <rect x="42" y="74" width="16" height="10" rx="3" fill="#38bdf8" opacity="0.3" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-tight text-white leading-none">JOIN</span>
          <span className="text-[8px] font-bold tracking-widest text-cyan-400 uppercase mt-0.5">Hacemos que suceda</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* Main Graphic Box: Figures + JOIN letters + AI Robot */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 340 130"
          className="w-full h-auto max-w-[280px] sm:max-w-[320px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS & GRADIENTS */}
          <defs>
            <linearGradient id="joinTextGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#223354" />
              <stop offset="100%" stopColor="#111c30" />
            </linearGradient>
            <linearGradient id="robotGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="tealFigure" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="cyanFigure" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND SUBTLE AI ENERGY HALO */}
          <circle cx="260" cy="55" r="42" fill="#0ea5e9" opacity="0.12" filter="url(#glowFilter)" />

          {/* PEOPLE FIGURES (3 stylized team members jumping with arms outstretched) */}
          <g transform="translate(75, 8)">
            {/* Left person (Darker Teal/Navy) */}
            <circle cx="28" cy="40" r="5" fill="#1e293b" />
            <path d="M28 46 C24 50 12 55 5 44 C8 42 16 48 24 48 C20 40 16 35 12 34 C14 32 20 37 26 44 Z" fill="#1e293b" />

            {/* Center person (Teal/Cyan) */}
            <circle cx="48" cy="22" r="5.5" fill="url(#tealFigure)" />
            <path d="M48 29 C44 38 32 45 22 36 C25 34 35 40 43 38 C42 28 38 20 30 18 C33 16 40 22 46 29 Z" fill="url(#tealFigure)" />
            <path d="M48 29 C52 38 64 45 74 36 C71 34 61 40 53 38 C54 28 58 20 66 18 C63 16 56 22 50 29 Z" fill="url(#tealFigure)" />

            {/* Right person (Bright Sky Blue) */}
            <circle cx="68" cy="32" r="5" fill="url(#cyanFigure)" />
            <path d="M68 38 C72 44 82 48 90 40 C87 38 80 43 73 42 C76 34 81 28 88 26 C85 24 79 29 71 36 Z" fill="url(#cyanFigure)" />
          </g>

          {/* MAIN 'JOIN' LOGO TYPOGRAPHY */}
          <g fill="url(#joinTextGrad)">
            {/* J */}
            <path d="M22 42 H44 V88 C44 100 36 106 20 106 C12 106 4 104 0 100 L4 86 C7 89 12 91 18 91 C24 91 28 88 28 82 V42 Z" />
            {/* O */}
            <path d="M84 40 C104 40 118 54 118 73 C118 92 104 106 84 106 C64 106 50 92 50 73 C50 54 64 40 84 40 Z M84 56 C73 56 66 63 66 73 C66 83 73 90 84 90 C95 90 102 83 102 73 C102 63 95 56 84 56 Z" />
            {/* I */}
            <path d="M128 42 H144 V104 H128 Z" />
            {/* N */}
            <path d="M156 42 H172 L198 80 V42 H214 V104 H198 L172 66 V104 H156 Z" />
          </g>

          {/* AI ROBOT CHARACTER (Inspired by Option 1 / 2) */}
          <g transform="translate(230, 24)">
            {/* Robot Antenna with glowing orb */}
            <circle cx="36" cy="6" r="4.5" fill="#38bdf8" filter="url(#glowFilter)" />
            <circle cx="36" cy="6" r="3.5" fill="#00f2fe" />
            <line x1="36" y1="10" x2="36" y2="18" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />

            {/* Left and Right Ears / Headsets */}
            <rect x="6" y="26" width="6" height="15" rx="3" fill="#0284c7" />
            <rect x="60" y="26" width="6" height="15" rx="3" fill="#0284c7" />

            {/* Robot Head */}
            <rect x="10" y="16" width="52" height="38" rx="14" fill="url(#robotGlow)" stroke="#0ea5e9" strokeWidth="2.5" />

            {/* Dark Visor */}
            <rect x="16" y="24" width="40" height="22" rx="9" fill="#0f172a" />

            {/* Glowing AI Visor Eyes */}
            <ellipse cx="27" cy="34" rx="4.5" ry="5.5" fill="#38bdf8" />
            <circle cx="28.5" cy="32.5" r="1.5" fill="#ffffff" />
            
            <ellipse cx="45" cy="34" rx="4.5" ry="5.5" fill="#38bdf8" />
            <circle cx="46.5" cy="32.5" r="1.5" fill="#ffffff" />

            {/* Happy mouth curve */}
            <path d="M33 40 Q36 43 39 40" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

            {/* Robot Neck */}
            <rect x="30" y="54" width="12" height="4" rx="2" fill="#0284c7" />

            {/* Robot Body */}
            <path d="M22 58 L20 74 Q20 78 26 78 L46 78 Q52 78 52 74 L50 58 Z" fill="url(#robotGlow)" stroke="#0ea5e9" strokeWidth="2" />

            {/* Chest screen / core */}
            <rect x="28" y="62" width="16" height="8" rx="2.5" fill="#0f172a" />
            <line x1="31" y1="66" x2="41" y2="66" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

            {/* Robot Arms */}
            {/* Left Arm waving cheerfully */}
            <path d="M20 62 Q12 55 8 60 Q6 64 12 68 Q18 70 21 68" fill="url(#robotGlow)" stroke="#0ea5e9" strokeWidth="1.8" />
            {/* Right Arm */}
            <path d="M51 62 Q58 64 62 70 Q60 74 54 74 L50 68" fill="url(#robotGlow)" stroke="#0ea5e9" strokeWidth="1.8" />

            {/* Legs */}
            <rect x="25" y="77" width="8" height="9" rx="3" fill="#0284c7" />
            <rect x="39" y="77" width="8" height="9" rx="3" fill="#0284c7" />
          </g>

          {/* UNDERLINE DIVIDER */}
          <line x1="2" y1="112" x2="330" y2="112" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />

          {/* SLOGAN: "HACEMOS QUE SUCEDA" */}
          <text
            x="166"
            y="126"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="12.5"
            fontWeight="900"
            letterSpacing="3.5"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            HACEMOS QUE SUCEDA
          </text>
        </svg>
      </div>
    </div>
  );
};
