import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading financial insights...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
        <Loader2 className="w-6 h-6 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-sm text-slate-700 font-medium">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Executing mathematical analysis...</p>
    </div>
  );
}
