import React, { useState, useRef } from 'react';
import { Wifi, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export default function HolographicSmartCard({
  cardholderName = 'PREMIUM MEMBER',
  balance = '₹50,00,000',
  cardType = 'AI OBSIDIAN TIER',
  className = '',
}) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate 3D tilt angles (max +/- 18 degrees)
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    // Specular glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div className={`perspective-1000 w-full max-w-[380px] select-none ${className}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${
            isHovered ? 'scale3d(1.03, 1.03, 1.03)' : 'scale3d(1, 1, 1)'
          }`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className="relative preserve-3d h-56 rounded-2xl p-6 overflow-hidden cursor-pointer shadow-2xl transition-shadow duration-300"
      >
        {/* Card Base Layer (Obsidian Dark Glass with Emerald-Cyan Gradient Edge) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#061233] via-[#08224F] to-[#00112E] border border-emerald-500/30 rounded-2xl shadow-3d-card" />

        {/* Cyber grid texture */}
        <div className="absolute inset-0 cyber-grid-dark opacity-30 rounded-2xl pointer-events-none" />

        {/* Ambient Glow Orbs behind card content */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Dynamic Holographic Glare Layer (Reacts to cursor position) */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.4) 0%, rgba(0,186,242,0.25) 30%, rgba(6,182,212,0.15) 50%, transparent 70%)`,
            opacity: glare.opacity,
          }}
        />

        {/* CARD CONTENT WITH 3D DEPTH (translate-z) */}
        <div className="relative z-10 h-full flex flex-col justify-between preserve-3d">
          {/* Top Row: Bank Header, Contactless Icon, AI Beacon */}
          <div className="flex items-center justify-between translate-z-30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-glow-emerald">
                <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
              </div>
              <div>
                <span className="font-extrabold tracking-widest text-sm text-white flex items-center gap-1.5">
                  VITTARA <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-normal px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">3.8 AI</span>
                </span>
                <span className="block text-[9px] text-slate-400 tracking-wider">SMART FINANCIAL CORE</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Wifi className="w-5 h-5 rotate-90 text-emerald-400/80" />
            </div>
          </div>

          {/* Middle Row: Metallic EMV Chip + Holographic Crest */}
          <div className="flex items-center justify-between translate-z-40 my-auto">
            {/* Metallic Gold EMV Chip */}
            <div className="relative w-11 h-8 rounded-md bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-amber-300">
              <Cpu className="w-6 h-6 text-amber-900/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer pointer-events-none" />
            </div>

            {/* Live Instant Capacity/Balance */}
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-300/80 flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                VERIFIED PRE-APPROVED
              </div>
              <div className="text-xl font-extrabold text-white font-mono tracking-tight drop-shadow-md">
                {balance}
              </div>
            </div>
          </div>

          {/* Bottom Row: Card Details & Security Seal */}
          <div className="flex items-end justify-between translate-z-30 pt-1 border-t border-white/10">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400">CARDHOLDER</div>
              <div className="text-xs font-bold text-slate-100 tracking-wider uppercase font-mono">{cardholderName}</div>
            </div>

            <div className="text-center">
              <div className="text-[10px] font-mono tracking-widest text-slate-400">SECURITY</div>
              <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-BIT
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono tracking-widest text-slate-400">TIER</div>
              <div className="text-xs font-mono text-amber-300 font-bold">{cardType}</div>
            </div>
          </div>
        </div>

        {/* 3D Border Glow on Hover */}
        <div className={`absolute inset-0 rounded-2xl border-2 transition-colors duration-300 pointer-events-none ${isHovered ? 'border-emerald-400/60 shadow-glow-emerald' : 'border-transparent'}`} />
      </div>
    </div>
  );
}
