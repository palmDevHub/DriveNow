import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, ShieldCheck, Key, FileCheck, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, showToast, t, language } = useApp();
  const isEn = language === 'en';

  const [formData, setFormData] = useState({
    name: currentUser ? currentUser.name : (isEn ? 'Pongsakorn Jaidee' : 'นายพงศกร ใจดี'),
    email: currentUser ? currentUser.email : 'palm@example.com',
    phone: currentUser ? currentUser.phone : '081-234-5678',
    driverLicense: currentUser ? (currentUser.driver_license || 'DL-99182347') : 'DL-99182347',
    idCard: currentUser ? (currentUser.id_card || '1-1002-99881-22-3') : '1-1002-99881-22-3'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast(isEn ? 'Personal information saved successfully!' : 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast(isEn ? 'New passwords do not match' : 'รหัสผ่านใหม่ไม่ตรงกัน', 'warning');
      return;
    }
    showToast(isEn ? 'Password changed successfully!' : 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!', 'success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
          <User className="w-4 h-4" /> Account Settings
        </div>
        <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
          {t.accountSettings}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t.accountSettingsSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Profile Avatar Summary */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6 text-center">
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-blue-500 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 bg-emerald-500 p-1.5 rounded-full text-slate-950 border-2 border-slate-900" title={t.verifiedBadge}>
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{formData.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{formData.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded-full uppercase">
              {currentUser ? currentUser.role : 'Customer'}
            </span>
          </div>

          <div className="border-t border-slate-800 pt-4 text-xs space-y-2 text-left text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">{t.docStatus}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" /> {t.verifiedBadge}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t.regDate}</span>
              <span>{isEn ? 'January 10, 2025' : '10 มกราคม 2025'}</span>
            </div>
          </div>
        </div>

        {/* Right Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile Details Form */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> {t.editProfileTitle}
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">{t.fullName}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">{t.emailLabel}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">{t.idCardNumber}</label>
                  <input
                    type="text"
                    value={formData.idCard}
                    onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">{t.driverLicense}</label>
                  <input
                    type="text"
                    value={formData.driverLicense}
                    onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-950/50"
                >
                  <Save className="w-4 h-4" /> {t.saveInfo}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-500" /> {t.changePasswordTitle}
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">{t.currentPassword}</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">{t.newPassword}</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">{t.confirmPassword}</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  {t.changePasswordBtn}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};


