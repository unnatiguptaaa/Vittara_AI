import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Unable to Load Data',
  message = 'An error occurred while processing your request.',
  onRetry = null,
  className = ''
}) {
  return (
    <div className={`rounded-2xl border border-rose-800/50 bg-rose-950/15 p-6 text-center shadow-fintech-sm ${className}`}>
      <div className="w-10 h-10 rounded-full bg-rose-900/40 border border-rose-700/50 text-rose-400 mx-auto flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-bold text-rose-400">{title}</h4>
      <p className="text-xs text-rose-400/90 mt-1 max-w-md mx-auto leading-relaxed">{message}</p>
      
      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={onRetry}
            icon={RefreshCw}
            className="border-rose-800/60 text-rose-500 hover:bg-rose-900/30"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
