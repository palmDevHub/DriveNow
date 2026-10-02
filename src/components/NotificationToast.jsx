import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-down max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
        isSuccess 
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' 
          : isWarning 
          ? 'bg-amber-950/90 border-amber-500/40 text-amber-200' 
          : 'bg-slate-900/90 border-red-500/40 text-slate-100'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
        {!isSuccess && !isWarning && <Info className="w-5 h-5 text-red-400 shrink-0" />}
        
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};
