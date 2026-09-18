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
    <div className={`rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center shadow-xs ${className}`}>
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-rose-900">{title}</h4>
      <p className="text-sm text-rose-700 mt-1 max-w-md mx-auto">{message}</p>
      
      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={onRetry}
            icon={RefreshCw}
            className="border-rose-300 text-rose-800 hover:bg-rose-100"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
