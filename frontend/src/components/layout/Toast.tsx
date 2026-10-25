'use client';

import React from 'react';
import { useToast } from '@/hooks/useToast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgStyle = 'bg-[#edf4fb] border-[#cfe2ff] text-[#1e3a5f]';
        let Icon = Info;
        let iconColor = 'text-[#2b6cb0]';

        if (toast.type === 'success') {
          bgStyle = 'bg-[#eef8ee] border-[#cce8ce] text-[#1b4324]';
          Icon = CheckCircle2;
          iconColor = 'text-[#2e7d32]';
        } else if (toast.type === 'error') {
          bgStyle = 'bg-[#fdf0f0] border-[#fad2d2] text-[#5f2120]';
          Icon = AlertCircle;
          iconColor = 'text-[#c53030]';
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-[#fdf7ea] border-[#fae5be] text-[#6b4712]';
          Icon = AlertTriangle;
          iconColor = 'text-[#d69e2e]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-sm ${bgStyle} transition-all duration-200`}
            role="alert"
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="font-semibold text-xs tracking-wide uppercase opacity-85 mb-0.5">
                  {toast.title}
                </p>
              )}
              <p className="text-sm leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-800 p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
