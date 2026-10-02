import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  Calendar, 
  User, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  SlidersHorizontal,
  Home,
  Users,
  CreditCard,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, currentView, setCurrentView, logout, switchDemoRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = currentUser && currentUser.role === 'admin';

  const customerNavItems = [
    { id: 'home', label: 'หน้าแรก', icon: Home },
    { id: 'cars', label: 'รายการรถทั้งหมด', icon: Car },
    { id: 'my-bookings', label: 'รายการจองของฉัน', icon: Calendar },
    { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: User },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'admin-cars', label: 'จัดการรถ', icon: Car },
    { id: 'admin-bookings', label: 'จัดการการจอง', icon: Calendar },
    { id: 'admin-users', label: 'จัดการสมาชิก', icon: Users },
  ];

  const currentNavItems = isAdmin ? adminNavItems : customerNavItems;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView(isAdmin ? 'admin-dashboard' : 'home')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center shadow-lg shadow-red-900/30">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-white font-prompt">
                  Drive<span className="text-red-500">Now</span>
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-kanit">เช่ารถง่ายๆ เดินทางได้ทุกที่</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Controls & Demo Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Demo Role Quick Switcher */}
            <div className="bg-slate-900/90 border border-slate-800 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => switchDemoRole('customer')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  !isAdmin ? 'bg-slate-800 text-red-400 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                โหมดลูกค้า
              </button>
              <button
                onClick={() => switchDemoRole('admin')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isAdmin ? 'bg-red-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                โหมดแอดมิน
              </button>
            </div>

            {/* Profile Dropdown / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-slide-down">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-bold text-white">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setCurrentView(isAdmin ? 'admin-dashboard' : 'profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" /> ข้อมูลส่วนตัว
                    </button>
                    
                    {!isAdmin && (
                      <button
                        onClick={() => {
                          setCurrentView('my-bookings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" /> ประวัติการเช่ารถ
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-400" /> ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-4 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-900/40"
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">โหมดการใช้งาน:</span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => { switchDemoRole('customer'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-lg ${!isAdmin ? 'bg-slate-800 text-red-400 font-bold' : 'text-slate-400'}`}
              >
                ลูกค้า
              </button>
              <button
                onClick={() => { switchDemoRole('admin'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-lg ${isAdmin ? 'bg-red-600 text-white font-bold' : 'text-slate-400'}`}
              >
                แอดมิน
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {currentNavItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
                    currentView === item.id ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {currentUser ? (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full mt-2 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> ออกจากระบบ
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }}
                className="p-3 text-center text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-xl"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => { setCurrentView('register'); setMobileMenuOpen(false); }}
                className="p-3 text-center text-xs font-medium text-white bg-red-600 rounded-xl"
              >
                สมัครสมาชิก
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
