import React, { useState, useRef } from 'react';

export default function TiltCard({
  children,
  className = '',
  maxTilt = 10,
  accentColor = 'emerald',
  highlight = false,
  onClick = null,
  ...props
}) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const spotX = (x / rect.width) * 100;
    const spotY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setSpotlight({ x: spotX, y: spotY, opacity: 0.15 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setSpotlight({ x: 50, y: 50, opacity: 0 });
  };

  const glowColors = {
    emerald: 'rgba(16, 185, 129, 0.4)',
    teal: 'rgba(20, 184, 166, 0.4)',
    blue: 'rgba(59, 130, 246, 0.4)',
    indigo: 'rgba(99, 102, 241, 0.4)',
    amber: 'rgba(245, 158, 11, 0.4)',
    purple: 'rgba(168, 85, 247, 0.4)',
  };

  const currentGlow = glowColors[accentColor] || glowColors.emerald;

  return (
    <div className="perspective-1000 w-full h-full">
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${
            isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
          }`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
        }}
        className={`relative preserve-3d rounded-2xl bg-midnight-800/80 backdrop-blur-md border ${
          highlight
            ? 'border-emerald-500 shadow-glow-emerald ring-1 ring-emerald-500/30'
            : 'border-slate-700 hover:border-emerald-500/40'
        } ${onClick ? 'cursor-pointer' : ''} p-6 shadow-fintech-md transition-shadow duration-300 overflow-hidden ${
          isHovered ? 'shadow-fintech-lg' : ''
        } ${className}`}
        {...props}
      >
        {/* Dynamic cursor follow spotlight gradient */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, ${currentGlow} 0%, transparent 60%)`,
            opacity: spotlight.opacity,
          }}
        />

        {/* Ambient subtle corner glow */}
        <div
          className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
          style={{
            backgroundColor: currentGlow,
            opacity: isHovered ? 0.25 : 0.08,
          }}
        />

        {/* Content wrapper with 3D preserve style */}
        <div className="relative z-10 h-full flex flex-col justify-between preserve-3d">
          {children}
        </div>
      </div>
    </div>
  );
}
