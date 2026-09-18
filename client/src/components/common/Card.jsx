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
      className={`relative rounded-2xl bg-white border ${
        highlight
          ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
          : 'border-slate-200/90 shadow-xs hover:border-slate-300'
      } ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5' : ''
      } ${onClick ? 'cursor-pointer' : ''} p-5 md:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
