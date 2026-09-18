import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  prefix,
  suffix,
  disabled = false,
  required = false,
  className = '',
  min,
  max,
  step,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center rounded-xl bg-white border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-200 shadow-xs">
        {prefix && (
          <span className="pl-3.5 pr-2 text-slate-500 text-sm font-medium select-none pointer-events-none">
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${prefix ? 'pl-0' : ''} ${suffix ? 'pr-0' : ''}`}
          {...props}
        />

        {suffix && (
          <span className="pr-3.5 pl-2 text-slate-500 text-xs font-medium select-none pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium animate-fadeIn">
          <span>•</span> {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500 font-normal">
          {helperText}
        </p>
      )}
    </div>
  );
}
