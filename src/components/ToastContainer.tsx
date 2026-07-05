/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto w-full bg-stone-900 text-stone-100 dark:bg-stone-50 dark:text-stone-900 border border-stone-800 dark:border-stone-200 p-4 shadow-xl flex items-start gap-3 animate-slide-up duration-300"
        >
          {toast.type === 'success' && (
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs font-mono tracking-wide leading-relaxed">
            {toast.message}
          </div>

          <button
            id={`btn-close-toast-${toast.id}`}
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-stone-100 dark:text-stone-500 dark:hover:text-stone-900 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
