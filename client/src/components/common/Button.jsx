import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon = null,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-midnight-900 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-sm gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white shadow-fintech-emerald border border-emerald-400/20 focus:ring-emerald-500/50',
    secondary: 'bg-midnight-800 hover:bg-midnight-750 text-slate-300 border border-slate-700/70 hover:border-slate-600 shadow-fintech-sm focus:ring-slate-500/30',
    outline: 'border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-400 focus:ring-emerald-500/30',
    ghost: 'text-slate-400 hover:text-ivory hover:bg-slate-200/50 focus:ring-slate-500/20',
    danger: 'bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border border-rose-700/50 shadow-fintech-sm focus:ring-rose-500/30',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}
