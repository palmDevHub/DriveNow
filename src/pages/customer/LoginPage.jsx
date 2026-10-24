import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, User, Eye, EyeOff, Check, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { login, loginWithGoogle, setCurrentView, t, language } = useApp();
  const isEn = language === 'en';
  
  const [identifier, setIdentifier] = useState('User');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(identifier, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (uname, pass) => {
    setIdentifier(uname);
    setPassword(pass);
    setErrorMsg('');
    login(uname, pass);
  };

  return (
    <div className="py-6 sm:py-10 flex items-center justify-center px-4">
      {/* Phone/Card Mockup Container with Dark Theme matching the App */}
      <div className="w-full max-w-sm sm:max-w-md bg-slate-900 text-slate-100 rounded-[38px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] border border-slate-800 overflow-hidden transition-all duration-300">
        
        {/* Top Header with Vibrant Gradient matching App Theme & Smooth Wavy Edge */}
        <div className="relative bg-gradient-to-b from-blue-700 via-blue-800 to-indigo-950 pt-10 pb-16 px-6 text-center select-none overflow-hidden">
          
          {/* Subtle Ambient Glow Circles inside Header */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-0 -right-12 w-48 h-48 bg-blue-500/25 rounded-full blur-3xl pointer-events-none"></div>

          {/* Actual App Logo & Brand Header */}
          <div className="relative z-20 flex flex-col items-center justify-center space-y-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img 
                src="/herologo.jpg" 
                alt="Car Rental Songkhla" 
                className="relative w-16 h-16 rounded-2xl shadow-2xl object-cover border-2 border-white/30"
              />
            </div>
            
            <div className="text-center">
              <h1 className="text-xl font-extrabold tracking-wide text-white font-prompt drop-shadow-md">
                Car Rental Songkhla
              </h1>
              <p className="text-[11px] tracking-wider text-blue-200/90 font-kanit">
                เดินทางสบาย ในทุกเส้นทาง
              </p>
            </div>
          </div>

          {/* Smooth Curved SVG Wave at Bottom of Gradient - seamlessly transitions into bg-slate-900 */}
          <div className="absolute -bottom-0.5 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
            <svg 
              viewBox="0 0 500 90" 
              preserveAspectRatio="none" 
              className="w-full h-14 sm:h-16 text-slate-900 fill-current block"
            >
              <path d="M0,35 C150,85 300,-10 500,40 L500,90 L0,90 Z"></path>
            </svg>
          </div>
        </div>

        {/* Form Body Section matching App Dark Theme */}
        <div className="px-6 sm:px-8 pt-2 pb-8 space-y-5 bg-slate-900">
          
          {/* Welcome Text */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-prompt tracking-tight">
              {isEn ? 'Welcome back !' : 'Welcome back !'}
            </h2>
            <p className="text-xs text-slate-400 font-kanit">
              {isEn ? 'Sign in to continue your journey' : 'เข้าสู่ระบบเพื่อดำเนินการต่อ'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-medium shadow-sm animate-shake">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input Field */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={isEn ? "Username" : "Username (User หรือ andmin)"}
                  className="w-full pl-5 pr-11 py-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none transition-all shadow-inner"
                />
                {/* Validation Checkmark Icon when username has value */}
                {identifier.trim().length > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 bg-blue-500/20 border border-blue-500/30 p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEn ? "Password" : "Password (1234)"}
                  className="w-full pl-5 pr-12 py-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 focus:outline-none transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-full border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="group-hover:text-slate-200 transition">
                  {isEn ? 'Remember me' : 'จดจำฉันไว้'}
                </span>
              </label>

              <button
                type="button"
                onClick={() => alert(isEn ? 'Default password is: 1234' : 'รหัสผ่านเริ่มต้นคือ 1234 ครับ')}
                className="text-blue-400 hover:text-blue-300 transition cursor-pointer font-medium"
              >
                {isEn ? 'Forget password?' : 'Forgot password?'}
              </button>
            </div>

            {/* Modern Clean Flat Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 sm:py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition duration-150 cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <span>
                  {isEn ? 'Login' : 'Login'}
                </span>
              </button>
            </div>

            {/* New user? Sign Up */}
            <div className="text-center text-xs text-slate-400 pt-1">
              {isEn ? 'New user? ' : 'New user? '}
              <button
                type="button"
                onClick={() => setCurrentView('register')}
                className="text-blue-400 font-bold hover:text-blue-300 hover:underline cursor-pointer"
              >
                {isEn ? 'Sign Up' : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* OR Divider Line */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900 px-3 text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                OR
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons for User and Admin */}
          <div className="space-y-2">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider text-center">
              {isEn ? 'Quick One-Click Test Accounts' : 'คลิกเลือกบัญชีทดสอบด่วน'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* User Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin('User', '1234')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold transition duration-150 cursor-pointer select-none"
                title="สิทธิ์ User: เห็นเฉพาะเมนู User"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-200"></span>
                <span>User (1234)</span>
              </button>

              {/* andmin Button */}
              <button
                type="button"
                onClick={() => handleQuickLogin('andmin', '1234')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white bg-blue-600 hover:bg-blue-500 text-xs font-semibold transition duration-150 cursor-pointer select-none"
                title="สิทธิ์ Admin: เห็นทั้งระบบแอดมิน และ User"
              >
                <span className="w-2 h-2 rounded-full bg-blue-200"></span>
                <span>andmin (1234)</span>
              </button>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold flex items-center justify-center gap-2.5 transition duration-150 cursor-pointer select-none"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{isEn ? 'Sign in with Google' : 'เข้าสู่ระบบด้วย Google'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
