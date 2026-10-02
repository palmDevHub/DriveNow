import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { register, setCurrentView } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
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
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-950/50">
            <Car className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-prompt">
            สมัครสมาชิก <span className="text-red-500">DriveNow</span>
          </h2>
          <p className="text-xs text-slate-400">สร้างบัญชีสมาชิกเพื่อความสะดวกในการจองรถเช่า</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="กรอกชื่อ-นามสกุลจริง"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">อีเมล <span className="text-red-500">*</span></label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08X-XXX-XXXX"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">รหัสผ่าน <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="อย่างน้อย 6 หลัก"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">ยืนยันรหัสผ่าน <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="พิมพ์ซ้ำอีกครั้ง"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition"
          >
            <span>ยืนยันการสมัครสมาชิก</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          มีบัญชีอยู่แล้ว?{' '}
          <button
            onClick={() => setCurrentView('login')}
            className="text-red-400 font-bold hover:underline"
          >
            เข้าสู่ระบบที่นี่
          </button>
        </div>

      </div>
    </div>
  );
};
