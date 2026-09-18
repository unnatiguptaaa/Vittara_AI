import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  ArrowRight,
  Bot,
  IndianRupee,
  Percent,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Finance3DComposition({ className = '' }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { setCalculationResult } = useJourney();
  const { language } = useLanguage();

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Interactive Live State
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(36); // in months

  // Quick Preset options
  const amountPresets = [
    { label: '₹2L', value: 200000 },
    { label: '₹5L', value: 500000 },
    { label: '₹10L', value: 1000000 },
    { label: '₹25L', value: 2500000 },
  ];

  const tenureOptions = [12, 24, 36, 48, 60];

  // Mathematical Reducing-Balance EMI Calculation (RBI Standard Formula)
  const calculateFinance = (p, r, n) => {
    const monthlyRate = r / (12 * 100);
    if (monthlyRate === 0) {
      const emi = Math.round(p / n);
      return {
        monthlyEmi: emi,
        totalPayment: p,
        totalInterest: 0,
        principalPercent: 100,
        interestPercent: 0,
      };
    }
    const factor = Math.pow(1 + monthlyRate, n);
    const emi = Math.round((p * monthlyRate * factor) / (factor - 1));
    const totalPayment = emi * n;
    const totalInterest = Math.max(0, totalPayment - p);
    const principalPercent = Math.min(100, Math.max(0, Math.round((p / totalPayment) * 100)));
    const interestPercent = 100 - principalPercent;

    return {
      monthlyEmi: emi,
      totalPayment,
      totalInterest,
      principalPercent,
      interestPercent,
    };
  };

  const metrics = calculateFinance(amount, rate, tenure);

  // Save to active journey state and navigate to calculator
  const handleOpenCalculator = () => {
    setCalculationResult({
      requestedAmount: amount,
      interestRate: rate,
      tenureMonths: tenure,
      monthlyEmi: metrics.monthlyEmi,
      totalInterest: metrics.totalInterest,
      totalPayment: metrics.totalPayment,
      hasActiveJourney: true,
    });
    navigate('/calculator');
  };

  // Ask AI about this specific calculation
  const handleAskAI = () => {
    const prompt = `Can I afford a loan of ₹${amount.toLocaleString('en-IN')} at ${rate}% interest for ${tenure} months with an EMI of ₹${metrics.monthlyEmi.toLocaleString('en-IN')}? What should my minimum monthly salary be?`;
    navigate(`/chat?q=${encodeURIComponent(prompt)}`);
  };

  const handleReset = () => {
    setAmount(500000);
    setRate(10.5);
    setTenure(36);
  };

  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setCanHover(hoverQuery.matches);
    setReducedMotion(motionQuery.matches);

    const handleHoverChange = (e) => setCanHover(e.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);

    hoverQuery.addEventListener('change', handleHoverChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      hoverQuery.removeEventListener('change', handleHoverChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!canHover || reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Responsive 3D tilt
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[500px] select-none perspective-1000 ${className}`}
      aria-label="Interactive 3D Financial Simulator"
    >
      {/* Soft environmental lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Decorative SVG Orbital Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="250"
          cy="250"
          rx="220"
          ry="115"
          transform="rotate(-20 250 250)"
          stroke="#00BAF2"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.4"
        />
        <ellipse
          cx="250"
          cy="250"
          rx="190"
          ry="95"
          transform="rotate(25 250 250)"
          stroke="#FFB800"
          strokeWidth="0.8"
          strokeDasharray="2 5"
          strokeOpacity="0.3"
        />
      </svg>

      {/* 3D Preserved Layer Stack */}
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: reducedMotion ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative preserve-3d py-6 px-2 sm:px-4"
      >
        {/* Floating Gold Coin (Top-Right) */}
        <div
          className={`absolute -top-4 -right-1 z-30 translate-z-40 pointer-events-none ${
            reducedMotion ? '' : 'animate-float-gentle'
          }`}
        >
          <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="goldEdgeLive" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#926f1c" />
              </linearGradient>
              <linearGradient id="goldFaceLive" x1="15" y1="15" x2="65" y2="65" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="50%" stopColor="#0a0a0a" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="38" fill="url(#goldEdgeLive)" />
            <circle cx="40" cy="40" r="35" fill="url(#goldFaceLive)" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.8" />
            <circle cx="40" cy="40" r="31" stroke="#d4af37" strokeWidth="0.75" strokeDasharray="2 3" strokeOpacity="0.6" />
            <text
              x="40"
              y="48"
              textAnchor="middle"
              fill="#fef08a"
              fontSize="24"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="bold"
            >
              ₹
            </text>
          </svg>
        </div>

        {/* Main Floating Interactive EMI Card with Specific Cyan Edge Glow on Hover */}
        <div className="black-card-3d edge-glow-cyan p-5 sm:p-6 backdrop-blur-xl translate-z-20 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-850">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400 shadow-sm">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Live EMI Engine
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </span>
                <span className="text-[10px] text-zinc-400 block">Interactive Loan Simulator</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              title="Reset to default"
              className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800/80 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Sliders & Presets */}
          <div className="py-3 space-y-3.5 text-xs">
            {/* Amount Slider & Presets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-cyan-400" />
                  Loan Amount
                </span>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="50000"
                max="5000000"
                step="25000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />

              {/* Amount Quick Presets */}
              <div className="flex items-center gap-1.5 pt-0.5">
                {amountPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setAmount(preset.value)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono transition-all ${
                      amount === preset.value
                        ? 'bg-cyan-500 text-black shadow-xs font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-emerald-400" />
                  Interest Rate (p.a.)
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {rate}%
                </span>
              </div>
              <input
                type="range"
                min="7.0"
                max="18.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
              />
            </div>

            {/* Tenure Options */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  Tenure
                </span>
                <span className="font-mono font-semibold text-zinc-300 text-xs">
                  {tenure} Months ({(tenure / 12).toFixed(1)} Yrs)
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {tenureOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenure(t)}
                    className={`py-1 rounded text-center text-[10px] font-mono font-semibold transition-all ${
                      tenure === t
                        ? 'bg-amber-400 text-black font-bold shadow-xs'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                    }`}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Live Calculated EMI Display */}
          <div className="py-3.5 px-4 my-2 rounded-2xl bg-zinc-950 border border-zinc-800 text-center shadow-inner">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
              Estimated Monthly EMI
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5 flex items-baseline justify-center gap-1">
              <span className="text-cyan-300 font-mono drop-shadow-[0_0_15px_rgba(0,174,239,0.35)]">
                ₹{metrics.monthlyEmi.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-zinc-500 font-normal">/ mo</span>
            </div>
          </div>

          {/* Animated Distribution Breakdown Bar */}
          <div className="space-y-1.5 py-1">
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Principal: ₹{amount.toLocaleString('en-IN')} ({metrics.principalPercent}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Interest: ₹{metrics.totalInterest.toLocaleString('en-IN')} ({metrics.interestPercent}%)
              </span>
            </div>
            {/* Dynamic visual width bar */}
            <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden flex border border-zinc-800">
              <div
                style={{ width: `${metrics.principalPercent}%`, transition: 'width 0.3s ease' }}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-l-full"
              />
              <div
                style={{ width: `${metrics.interestPercent}%`, transition: 'width 0.3s ease' }}
                className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-r-full"
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-400 pt-0.5 font-mono">
              <span>Total: ₹{metrics.totalPayment.toLocaleString('en-IN')}</span>
              <span>{(tenure / 12).toFixed(1)} Years</span>
            </div>
          </div>

          {/* Effective Action Buttons */}
          <div className="pt-3.5 mt-2 border-t border-zinc-850 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleOpenCalculator}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-sm hover:shadow-[0_0_15px_rgba(0,174,239,0.4)] transition-all active:scale-95"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleAskAI}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all active:scale-95 hover:border-cyan-400"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Floating Silver Coin (Bottom-Left) */}
        <div
          className={`absolute -bottom-3 -left-1 z-30 translate-z-30 pointer-events-none ${
            reducedMotion ? '' : 'animate-float-reverse'
          }`}
        >
          <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
            <defs>
              <linearGradient id="silverEdgeLive" x1="0" y1="0" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00BAF2" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#123F7B" />
              </linearGradient>
              <linearGradient id="silverFaceLive" x1="10" y1="10" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#0a1c3c" />
              </linearGradient>
            </defs>
            <circle cx="35" cy="35" r="33" fill="url(#silverEdgeLive)" />
            <circle cx="35" cy="35" r="30" fill="url(#silverFaceLive)" stroke="#00BAF2" strokeWidth="1" strokeOpacity="0.7" />
            <text
              x="35"
              y="42"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="20"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="bold"
            >
              ₹
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

