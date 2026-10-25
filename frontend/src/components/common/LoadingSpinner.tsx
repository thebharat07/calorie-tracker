'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  label = 'Loading...',
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-slate-500 gap-2.5 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-[#3b7a57]`} />
      {label && <p className="text-xs font-medium text-slate-600">{label}</p>}
    </div>
  );
}
