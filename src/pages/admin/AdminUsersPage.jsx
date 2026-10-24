import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, ShieldCheck, User, Phone, Mail, Edit, Trash2, Plus, X, Check } from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminUsersPage = () => {
  const { users, addUser, updateUser, deleteUser, showToast, t, language } = useApp();
  const isEn = language === 'en';
  const [keyword, setKeyword] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form State for Add User
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    id_card: '',
    driver_license: ''
  });

  // Form State for Edit User
  const [editUserForm, setEditUserForm] = useState({
    name: '',
    phone: '',
    role: 'customer',
    id_card: '',
    driver_license: ''
  });

  const filteredUsers = users.filter(u => {
    if (!keyword) return true;
    const kw = keyword.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(kw)) ||
      (u.email && u.email.toLowerCase().includes(kw)) ||
      (u.phone && u.phone.includes(kw))
    );
  });

  const handleToggleRole = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    updateUser(userId, { role: newRole });
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditUserForm({
      name: user.name || '',
      phone: user.phone || '',
      role: user.role || 'customer',
      id_card: user.id_card || '',
      driver_license: user.driver_license || ''
    });
  };

  const handleSaveAddUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      showToast('กรุณากรอกชื่อและอีเมลให้ครบถ้วน', 'warning');
      return;
    }
    const res = await addUser(newUserForm);
    if (res && res.success) {
      setIsAddModalOpen(false);
      setNewUserForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer',
        id_card: '',
        driver_license: ''
      });
    }
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    await updateUser(editingUser.user_id, editUserForm);
    setEditingUser(null);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
            <Users className="w-4 h-4" /> Member Administration (CRUD)
          </div>
          <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
            {isEn ? 'Manage Members / Customers' : 'จัดการสมาชิก (Manage Customers / Users)'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isEn ? 'Add, edit, inspect, and remove member accounts and manage roles.' : 'เพิ่ม แก้ไข ตรวจสอบ และลบรายชื่อสมาชิก พร้อมกำหนดสิทธิ์บทบาท (Role-Based Access)'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isEn ? 'Add New User' : 'เพิ่มผู้ใช้งานใหม่'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={isEn ? 'Search by name, email or phone...' : 'ค้นหาตามชื่อ อีเมล หรือเบอร์โทรศัพท์...'}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">{isEn ? 'Photo' : 'รูปภาพ'}</th>
                <th className="p-4">{isEn ? 'User ID' : 'รหัสสมาชิก'}</th>
                <th className="p-4">{t.fullNameLabel}</th>
                <th className="p-4">{isEn ? 'Email / Phone' : 'อีเมล/เบอร์โทร'}</th>
                <th className="p-4">{isEn ? 'License / ID No.' : 'ใบขับขี่ / เลขบัตร'}</th>
                <th className="p-4">{isEn ? 'Role' : 'บทบาท (Role)'}</th>
                <th className="p-4 text-right">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => {
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u.user_id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-blue-400">{u.user_id}</td>
                    <td className="p-4 font-bold text-white text-sm">{u.name}</td>
                    <td className="p-4">
                      <div className="text-white font-medium">{u.email}</div>
                      <div className="text-[10px] text-slate-400">{u.phone}</div>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      <div>{isEn ? 'License:' : 'ใบขับขี่:'} {u.driver_license || '-'}</div>
                      <div>{isEn ? 'ID Card:' : 'บัตรปชช:'} {u.id_card || '-'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        isAdmin
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {isAdmin ? '🛡️ Admin' : '👤 Customer'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Switch Role Quick Button */}
                        <button
                          onClick={() => handleToggleRole(u.user_id, u.role)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium rounded-lg transition"
                          title="สลับสิทธิ์การใช้งาน"
                        >
                          {isAdmin ? 'Set Customer' : 'Set Admin'}
                        </button>

                        {/* Edit User Button */}
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                          title={isEn ? 'Edit User' : 'แก้ไขข้อมูลสมาชิก'}
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-400" />
                        </button>

                        {/* Delete User Button with Confirmation */}
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-400 rounded-lg transition"
                          title={isEn ? 'Delete User' : 'ลบผู้ใช้นี้'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-prompt">
                {isEn ? 'Add New Member' : 'เพิ่มผู้ใช้งาน / สมาชิกใหม่'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">{t.fullNameLabel} *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="เช่น นายสมชาย ใจดี"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">{t.emailLabel} *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">{t.passwordLabel} (ค่าเริ่มต้น: 1234)</label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="รหัสผ่านเข้าสู่ระบบ (เว้นว่างไว้จะเป็น 1234)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">{t.phoneLabel}</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={e => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="08X-XXX-XXXX"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">สิทธิ์ (Role)</label>
                  <select
                    value={newUserForm.role}
                    onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="customer">Customer (ผู้ใช้ทั่วไป)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">เลขประจำตัวประชาชน</label>
                  <input
                    type="text"
                    value={newUserForm.id_card}
                    onChange={e => setNewUserForm({ ...newUserForm, id_card: e.target.value })}
                    placeholder="1-XXXX-XXXXX-XX-X"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">เลขที่ใบขับขี่</label>
                  <input
                    type="text"
                    value={newUserForm.driver_license}
                    onChange={e => setNewUserForm({ ...newUserForm, driver_license: e.target.value })}
                    placeholder="DL-XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {isEn ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/30"
                >
                  {isEn ? 'Create User' : 'บันทึกผู้ใช้'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-prompt">
                {isEn ? 'Edit Member Information' : `แก้ไขข้อมูล: ${editingUser.name}`}
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">{t.fullNameLabel} *</label>
                <input
                  type="text"
                  required
                  value={editUserForm.name}
                  onChange={e => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">{t.phoneLabel}</label>
                  <input
                    type="text"
                    value={editUserForm.phone}
                    onChange={e => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">สิทธิ์ (Role)</label>
                  <select
                    value={editUserForm.role}
                    onChange={e => setEditUserForm({ ...editUserForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="customer">Customer (ผู้ใช้ทั่วไป)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">เลขประจำตัวประชาชน</label>
                  <input
                    type="text"
                    value={editUserForm.id_card}
                    onChange={e => setEditUserForm({ ...editUserForm, id_card: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">เลขที่ใบขับขี่</label>
                  <input
                    type="text"
                    value={editUserForm.driver_license}
                    onChange={e => setEditUserForm({ ...editUserForm, driver_license: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {isEn ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/30"
                >
                  {isEn ? 'Save Changes' : 'บันทึกการแก้ไข'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deleting User */}
      <ConfirmModal
        isOpen={!!userToDelete}
        title={isEn ? 'Delete Member' : 'ยืนยันการลบสมาชิก'}
        message={userToDelete ? (isEn ? `Are you sure you want to delete ${userToDelete.name} (${userToDelete.email})? This action cannot be undone.` : `คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้คุณ ${userToDelete.name} (${userToDelete.email})? การดำเนินการนี้ไม่สามารถย้อนกลับได้`) : ''}
        confirmText={isEn ? 'Delete User' : 'ยืนยันการลบ'}
        cancelText={isEn ? 'Cancel' : 'ยกเลิก'}
        confirmVariant="danger"
        onConfirm={() => {
          if (userToDelete) {
            deleteUser(userToDelete.user_id);
            setUserToDelete(null);
          }
        }}
        onClose={() => setUserToDelete(null)}
        isEn={isEn}
      />

    </div>
  );
};
