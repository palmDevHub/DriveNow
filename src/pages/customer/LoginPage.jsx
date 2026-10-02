import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { login, setCurrentView, switchDemoRole } = useApp();
  const [email, setEmail] = useState('palm@example.com');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-950/50">
            <Car className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-prompt">
            เข้าสู่ระบบ <span className="text-red-500">DriveNow</span>
          </h2>
          <p className="text-xs text-slate-400">ยินดีต้อนรับกลับมา! กรุณาระบุอีเมลและรหัสผ่าน</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">อีเมล (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="palm@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-semibold">รหัสผ่าน (Password)</label>
              <span className="text-[11px] text-red-400 hover:underline cursor-pointer">ลืมรหัสผ่าน?</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition"
          >
            <span>เข้าสู่ระบบ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Preset Account Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] text-slate-400 text-center font-semibold uppercase tracking-wider">
            ทดลองเข้าสู่ระบบด่วน (Demo One-Click Login):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setEmail('palm@example.com');
                setPassword('password123');
                login('palm@example.com', 'password123');
              }}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-medium rounded-xl text-center"
            >
              👤 บัญชีลูกค้า demo
            </button>

            <button
              onClick={() => {
                setEmail('admin@drivenow.com');
                setPassword('adminpassword');
                login('admin@drivenow.com', 'adminpassword');
              }}
              className="px-3 py-2 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-300 text-[11px] font-medium rounded-xl text-center"
            >
              🛡️ บัญชีแอดมิน demo
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2">
          ยังไม่มีบัญชีสมาชิก?{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="text-red-400 font-bold hover:underline"
          >
            สมัครสมาชิกใหม่
          </button>
        </div>

      </div>
    </div>
  );
};
