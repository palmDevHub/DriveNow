import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const { login, loginWithGoogle, setCurrentView, switchDemoRole, t, language } = useApp();
  const isEn = language === 'en';
  const [email, setEmail] = useState('palm@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
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
          <img src="/herologo.jpg" alt="Car Rental Songkhla" className="w-16 h-16 mx-auto rounded-2xl shadow-lg shadow-blue-950/50 object-cover" />
          <h2 className="text-2xl font-extrabold text-white font-prompt">
            {t.loginHeading} <span className="text-blue-500">Car Rental Songkhla</span>
          </h2>
          <p className="text-xs text-slate-400">{t.loginSub}</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">{t.emailLabel} (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="palm@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-semibold">{t.currentPassword} (Password)</label>
              <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">{t.forgotPassword}</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/50 flex items-center justify-center gap-2 transition"
          >
            <span>{t.loginHeading}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900/90 px-3 text-[10px] uppercase text-slate-500 font-bold tracking-widest">{isEn ? 'OR' : 'หรือ'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-2 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>{isEn ? 'Continue with Google' : 'เข้าสู่ระบบด้วย Google'}</span>
          </button>
        </form>

        {/* Demo Fast Login Preset Account Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] text-slate-400 text-center font-semibold uppercase tracking-wider">
            {t.demoLoginHeader}
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
              {t.demoCustomerAcc}
            </button>

            <button
              onClick={() => {
                setEmail('admin@drivenow.com');
                setPassword('adminpassword');
                login('admin@drivenow.com', 'adminpassword');
              }}
              className="px-3 py-2 bg-blue-950/30 hover:bg-blue-900/40 border border-blue-500/30 text-blue-300 text-[11px] font-medium rounded-xl text-center"
            >
              {t.demoAdminAcc}
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2">
          {t.noAccountYet}{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="text-blue-400 font-bold hover:underline"
          >
            {t.registerHere}
          </button>
        </div>

      </div>
    </div>
  );
};


