import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, ShieldCheck, User, Phone, Mail, Edit } from 'lucide-react';

export const AdminUsersPage = () => {
  const { users, setUsers, showToast } = useApp();
  const [keyword, setKeyword] = useState('');

  const filteredUsers = users.filter(u => {
    if (!keyword) return true;
    const kw = keyword.toLowerCase();
    return (
      u.name.toLowerCase().includes(kw) ||
      u.email.toLowerCase().includes(kw) ||
      u.phone.includes(kw)
    );
  });

  const handleToggleRole = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    showToast(`ปรับเปลี่ยนสิทธิ์ผู้ใช้เป็น "${newRole}" เรียบร้อยแล้ว`, 'info');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar - Matching Wireframe 15 */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider">
          <Users className="w-4 h-4" /> Member Administration
        </div>
        <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
          จัดการสมาชิก (Manage Customers / Users)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ตรวจสอบรายชื่อสมาชิก ข้อมูลการติดต่อ ใบขับขี่ และปรับเปลี่ยนสิทธิ์บทบาท (Role)
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหาตามชื่อ อีเมล หรือเบอร์โทรศัพท์..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">รูปภาพ</th>
                <th className="p-4">รหัสสมาชิก</th>
                <th className="p-4">ชื่อ-นามสกุล</th>
                <th className="p-4">อีเมล/เบอร์โทร</th>
                <th className="p-4">ใบขับขี่ / เลขบัตร</th>
                <th className="p-4">บทบาท (Role)</th>
                <th className="p-4 text-right">ปรับสิทธิ์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => {
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u.user_id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-red-400">{u.user_id}</td>
                    <td className="p-4 font-bold text-white text-sm">{u.name}</td>
                    <td className="p-4">
                      <div className="text-white font-medium">{u.email}</div>
                      <div className="text-[10px] text-slate-400">{u.phone}</div>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      <div>ใบขับขี่: {u.driver_license || 'DL-99182347'}</div>
                      <div>บัตรปชช: {u.id_card || '1-1002-99881-XX'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        isAdmin
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {isAdmin ? '🛡️ Admin' : '👤 Customer'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleRole(u.user_id, u.role)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-xl"
                      >
                        สลับเป็น {isAdmin ? 'Customer' : 'Admin'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
