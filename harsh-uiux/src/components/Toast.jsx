import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/30 text-white'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/30 text-white'
                : 'bg-slate-900/90 border-slate-700 text-white'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${
                isSuccess
                  ? 'text-emerald-400'
                  : isWarning
                  ? 'text-amber-400'
                  : 'text-primary'
              }`}
            >
              {isSuccess ? 'check_circle' : isWarning ? 'warning' : 'info'}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-snug">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
