import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const RegisterPage = () => {
  const { register, setCurrentView, t, language } = useApp();
  const isEn = language === 'en';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!/^[0-9]{9,10}$/.test(formData.phone)) {
      setErrorMsg(isEn ? 'Phone number must contain only 9-10 digits.' : 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลักเท่านั้น');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg(isEn ? 'Passwords do not match' : 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    const res = register(formData);
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
            {t.registerHeading} <span className="text-blue-500">Car Rental Songkhla</span>
          </h2>
          <p className="text-xs text-slate-400">{t.registerSub}</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">{t.fullName} <span className="text-blue-500">*</span></label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.fullNamePlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">{t.emailLabel} <span className="text-blue-500">*</span></label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">{t.phoneLabel} <span className="text-blue-500">*</span></label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length <= 10) {
                    setFormData({ ...formData, phone: val });
                  }
                }}
                placeholder={t.phonePlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">{t.newPassword} <span className="text-blue-500">*</span></label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t.minCharsPassword}
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

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">{t.confirmPassword} <span className="text-blue-500">*</span></label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder={t.retypePassword}
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/50 flex items-center justify-center gap-2 transition"
          >
            <span>{t.confirmRegisterBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          {t.alreadyHaveAcc}{' '}
          <button
            onClick={() => setCurrentView('login')}
            className="text-blue-400 font-bold hover:underline"
          >
            {t.loginHere}
          </button>
        </div>

      </div>
    </div>
  );
};


