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
  ChevronDown,
  Sun,
  Moon,
  Globe,
  Bell
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentUser, 
    currentView, 
    setCurrentView, 
    logout, 
    switchDemoRole,
    language,
    theme,
    toggleLanguage,
    toggleTheme,
    t,
    bookings
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isAdmin = currentUser && currentUser.role === 'admin';

  // Notifications logic for customer and admin
  const notifications = isAdmin 
    ? (bookings ? bookings.filter(b => b.status === 'รอยืนยัน' || b.status === 'รอชำระเงิน') : [])
    : (bookings && currentUser ? bookings.filter(b => 
        (b.user_id === currentUser.user_id || b.user_email === currentUser.email) && 
        (b.status === 'ยืนยันแล้ว' || b.status === 'อนุมัติแล้ว')
      ) : []);

  const customerNavItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'cars', label: t.cars, icon: Car },
    { id: 'my-bookings', label: t.myBookings, icon: Calendar },
    { id: 'profile', label: t.profile, icon: User },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: t.adminDashboard, icon: LayoutDashboard },
    { id: 'admin-cars', label: t.adminCars, icon: Car },
    { id: 'admin-bookings', label: t.adminBookings, icon: Calendar },
    { id: 'admin-users', label: t.adminUsers, icon: Users },
  ];

  const currentNavItems = isAdmin ? adminNavItems : customerNavItems;

  return (
    <header className="relative z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView(isAdmin ? 'admin-dashboard' : 'home')}>
            <img src="/herologo.jpg" alt="Car Rental Songkhla" className="w-12 h-12 rounded-xl shadow-lg object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-prompt">
                  Car Rental Songkhla
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-kanit">เดินทางสบาย ในทุกเส้นทาง</p>
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
                      ? 'bg-blue-600 text-white keep-white shadow-md shadow-blue-900/30'
                      : theme === 'light'
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
          <div className="hidden md:flex items-center gap-2.5">

            {/* Language Switcher Button (TH / EN) */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition shadow-sm"
              title="Switch Language / เปลี่ยนภาษา"
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="uppercase font-mono tracking-wider">{language === 'th' ? 'TH 🇹🇭' : 'EN 🇬🇧'}</span>
            </button>

            {/* Theme Switcher Button (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1 transition shadow-sm"
              title={theme === 'dark' ? t.themeLight : t.themeDark}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Notification Bell (Customers & Admins) */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationOpen(!notificationOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition shadow-sm relative"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-slate-950">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 animate-slide-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-500" /> {isAdmin ? 'แจ้งเตือนระบบ (Admin)' : 'แจ้งเตือนของฉัน'}
                      </h3>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(b => (
                          <div 
                            key={b.booking_id} 
                            onClick={() => {
                              setCurrentView(isAdmin ? 'admin-bookings' : 'my-bookings');
                              setNotificationOpen(false);
                            }}
                            className="p-3 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition"
                          >
                            <p className="text-xs font-bold text-emerald-400 mb-1">
                              {isAdmin ? `🛎️ มีคำขอจองใหม่ (${b.status})` : '✅ อนุมัติการจองแล้ว'}
                            </p>
                            <p className="text-[11px] text-slate-300">
                              {isAdmin 
                                ? <>ผู้เช่า <strong>{b.user_name}</strong> ต้องการเช่า {b.car_name}</>
                                : <>คุณมีคิวรับรถ <strong>{b.car_name}</strong></>
                              }
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> วันที่: {b.start_date}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-slate-500 text-xs">
                          ไม่มีการแจ้งเตือนใหม่
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationOpen(false);
                  }}
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
                      className="w-full text-left px-4 py-2 text-xs font-medium text-blue-500 hover:bg-blue-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-blue-500" /> ออกจากระบบ
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
                  className="px-4 py-2 text-xs font-medium text-white keep-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-900/40"
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'th' ? 'TH' : 'EN'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

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
          {/* Removed Demo Role Quick Switcher */}

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
                    currentView === item.id ? 'bg-blue-600 text-white keep-white' : 'bg-slate-900 text-slate-300 border border-slate-800'
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
              className="w-full mt-2 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-500 font-medium flex items-center justify-center gap-2"
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
                className="p-3 text-center text-xs font-medium text-white keep-white bg-blue-600 rounded-xl"
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

