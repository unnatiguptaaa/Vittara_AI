import React from 'react';

export default function BrandMark({ className = '' }) {
  return <span className={`brand-mark ${className}`} aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M5 7h7l6 16-4 4L5 7Z" fill="currentColor" /><path d="m19 7-4 10 4 9L28 7h-9Z" fill="currentColor" opacity=".65" /></svg></span>;
}
