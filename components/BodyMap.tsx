'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BodyPart = 'head' | 'chest' | 'stomach' | 'arms' | 'legs';

interface BodyMapProps {
  onPartClick: (part: BodyPart) => void;
}

export default function BodyMap({ onPartClick }: BodyMapProps) {
  const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);

  return (
    <div className="relative w-full max-w-[320px] aspect-[1/2.2] mx-auto group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors duration-1000"></div>

      {/* Cybernetic Human Blueprint SVG */}
      <svg
        viewBox="0 0 100 220"
        className="w-full h-full relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <g 
          className="cursor-pointer transition-all duration-300 transform-gpu hover:-translate-y-1 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          fill={hoveredPart === 'head' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.05)'}
          stroke={hoveredPart === 'head' ? 'rgba(96, 165, 250, 1)' : 'rgba(59, 130, 246, 0.3)'}
          strokeWidth={hoveredPart === 'head' ? "1.5" : "1"}
          onMouseEnter={() => setHoveredPart('head')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => onPartClick('head')}
        >
          {/* Main Skull */}
          <rect x="40" y="10" width="20" height="24" rx="8" />
          {/* Jaw & Chin */}
          <path d="M44 30 L56 30 L53 38 L47 38 Z" strokeLinejoin="round"/>
          <path d="M50 14 L50 22 M44 18 H56" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" fill="none" />
        </g>

        {/* Chest */}
        <g 
          className="cursor-pointer transition-all duration-300 transform-gpu hover:scale-105 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          fill={hoveredPart === 'chest' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.05)'}
          stroke={hoveredPart === 'chest' ? 'rgba(34, 211, 238, 1)' : 'rgba(6, 182, 212, 0.3)'}
          strokeWidth={hoveredPart === 'chest' ? "1.5" : "1"}
          onMouseEnter={() => setHoveredPart('chest')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => onPartClick('chest')}
          style={{ transformOrigin: '50% 60px' }}
        >
          {/* Upper Torso */}
          <path d="M35 44 L65 44 C72 44 76 50 74 58 L68 76 L32 76 L26 58 C24 50 28 44 35 44 Z" strokeLinejoin="round" />
          {/* Chest Details */}
          <path d="M40 55 C45 58 55 58 60 55" strokeWidth="0.5" stroke="rgba(34, 211, 238, 0.5)" fill="none" />
          <path d="M50 44 L50 76" strokeWidth="0.5" stroke="rgba(34, 211, 238, 0.5)" fill="none" />
          <path d="M32 60 H68 M32 68 H68" strokeWidth="0.5" stroke="rgba(34, 211, 238, 0.5)" fill="none" />
        </g>

        {/* Stomach */}
        <g 
           className="cursor-pointer transition-all duration-300 transform-gpu hover:scale-105 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          fill={hoveredPart === 'stomach' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.05)'}
          stroke={hoveredPart === 'stomach' ? 'rgba(129, 140, 248, 1)' : 'rgba(99, 102, 241, 0.3)'}
          strokeWidth={hoveredPart === 'stomach' ? "1.5" : "1"}
          onMouseEnter={() => setHoveredPart('stomach')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => onPartClick('stomach')}
          style={{ transformOrigin: '50% 90px' }}
        >
          <path d="M33 80 L67 80 L63 108 C61 115 55 118 50 118 C45 118 39 115 37 108 L33 80 Z" strokeLinejoin="round" />
          {/* Belly lines */}
          <path d="M42 90 H58 M44 100 H56 M50 80 L50 118" strokeWidth="0.5" stroke="rgba(129, 140, 248, 0.5)" fill="none"/>
        </g>

        {/* Arms */}
        <g 
          className="cursor-pointer transition-all duration-300 transform-gpu hover:scale-[1.03] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          fill={hoveredPart === 'arms' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.05)'}
          stroke={hoveredPart === 'arms' ? 'rgba(192, 132, 252, 1)' : 'rgba(168, 85, 247, 0.3)'}
          strokeWidth={hoveredPart === 'arms' ? "1.5" : "1"}
          onMouseEnter={() => setHoveredPart('arms')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => onPartClick('arms')}
          style={{ transformOrigin: '50% 70px' }}
        >
          {/* Left Arm */}
          <rect x="16" y="46" width="12" height="38" rx="6" />
          <circle cx="22" cy="86" r="3.5" />
          <rect x="14" y="90" width="10" height="34" rx="5" />
          <path d="M14 126 H24 L22 138 H16 Z" strokeLinejoin="round"/>
          
          {/* Right Arm */}
          <rect x="72" y="46" width="12" height="38" rx="6" />
          <circle cx="78" cy="86" r="3.5" />
          <rect x="76" y="90" width="10" height="34" rx="5" />
          <path d="M76 126 H86 L84 138 H78 Z" strokeLinejoin="round"/>
        </g>

        {/* Legs */}
        <g 
           className="cursor-pointer transition-all duration-300 transform-gpu hover:scale-[1.03] hover:translate-y-1 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          fill={hoveredPart === 'legs' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.05)'}
          stroke={hoveredPart === 'legs' ? 'rgba(244, 114, 182, 1)' : 'rgba(236, 72, 153, 0.3)'}
          strokeWidth={hoveredPart === 'legs' ? "1.5" : "1"}
          onMouseEnter={() => setHoveredPart('legs')}
          onMouseLeave={() => setHoveredPart(null)}
          onClick={() => onPartClick('legs')}
          style={{ transformOrigin: '50% 150px' }}
        >
          {/* Left Upper Leg */}
          <path d="M38 122 L49 122 L45 160 L36 160 Z" strokeLinejoin="round" />
          {/* Left Knee Joint */}
          <circle cx="40.5" cy="164" r="3.5" />
          {/* Left Lower Leg & Foot */}
          <path d="M37 168 L44 168 L42 205 L30 205 L32 195 L35 168 Z" strokeLinejoin="round" />
          
          {/* Right Upper Leg */}
          <path d="M51 122 L62 122 L64 160 L55 160 Z" strokeLinejoin="round" />
          {/* Right Knee Joint */}
          <circle cx="59.5" cy="164" r="3.5" />
          {/* Right Lower Leg & Foot */}
          <path d="M56 168 L63 168 L65 195 L68 205 L58 205 L58 168 Z" strokeLinejoin="round" />
        </g>
      </svg>

      {/* Dynamic Labels Overlay */}
      <AnimatePresence>
        {hoveredPart && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-[110%] top-1/2 -translate-y-1/2 glass-card px-5 py-3 rounded-2xl whitespace-nowrap z-20 shadow-2xl border border-primary/20 backdrop-blur-xl bg-background/80"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              <span className="text-xs font-black text-foreground uppercase tracking-widest">
                Scan {hoveredPart}?
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
