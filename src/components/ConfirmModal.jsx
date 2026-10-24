import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'ยืนยันการดำเนินการ',
  message = 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการนี้? ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้',
  confirmText = 'ยืนยันการลบ',
  cancelText = 'ยกเลิก',
  confirmVariant = 'danger', // 'danger' | 'primary'
  onConfirm,
  onClose,
  isEn = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          {/* Warning Icon Badge */}
          <div className={`p-3 rounded-xl shrink-0 ${
            confirmVariant === 'danger'
              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-prompt">
              {title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition cursor-pointer flex items-center gap-1.5 ${
              confirmVariant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-sm'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-sm'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
