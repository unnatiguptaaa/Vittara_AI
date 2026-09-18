import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  highlight = false,
  onClick = null,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-midnight-800/80 backdrop-blur-md border ${
        highlight
          ? 'border-emerald-500/60 shadow-fintech-emerald ring-1 ring-emerald-500/20'
          : 'border-slate-800/90 shadow-fintech-md hover:border-slate-700/80'
      } ${
        hover
          ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-fintech-lg hover:border-slate-600/70'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} p-5 md:p-6 text-slate-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
