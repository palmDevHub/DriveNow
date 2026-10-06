import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTHB, getBookingStatusBadge, getCarStatusBadge } from '../../utils/formatters';
import { 
  Car, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  PieChart as PieIcon, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminDashboard = () => {
  const { cars, bookings, users, ADMIN_ANALYTICS, setCurrentView, updateBookingStatus, t, language } = useApp();

  // Metrics computation
  const totalCarsCount = cars.length;
  const availableCarsCount = cars.filter(c => c.status === 'ว่าง' || c.status === 'available').length;
  const rentedCarsCount = cars.filter(c => c.status === 'กำลังเช่า' || c.status === 'rented').length;
  
  const totalRevenue = bookings
    .filter(b => b.status === 'ยืนยันแล้ว' || b.status === 'กำลังใช้งาน' || b.status === 'คืนรถแล้ว')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const totalMembers = users.length;

  const COLORS = ['#E50914', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> {t.adminControlCenter}
          </div>
          <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
            {t.adminDashboardTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.adminDashboardSub}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('admin-cars')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-950/50 transition"
          >
            <Plus className="w-4 h-4" /> {t.addNewCarBtn}
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Total Cars */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-semibold">{t.totalCarsInSystem}</span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white font-prompt">{totalCarsCount}</span>
            <span className="text-xs text-slate-400 ml-2">{t.unitsCount}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span className="text-emerald-400 font-bold">{t.availableCount} {availableCarsCount} {t.unitsCount}</span>
            <span>•</span>
            <span className="text-blue-400 font-bold">{t.rentedCount} {rentedCarsCount} {t.unitsCount}</span>
          </div>
        </div>

        {/* Metric 2: Active Bookings */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-semibold">{t.totalBookingsInSystem}</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white font-prompt">{bookings.length}</span>
            <span className="text-xs text-slate-400 ml-2">{t.items}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span className="text-amber-400 font-bold">{t.pendingCount} {bookings.filter(b => b.status === 'รอยืนยัน').length} {t.items}</span>
          </div>
        </div>

        {/* Metric 3: Total Revenue */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-semibold">{t.totalRevenueAccumulated}</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-emerald-400 font-prompt">{formatTHB(totalRevenue, language)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 pt-1 border-t border-slate-800">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% {t.fromLastMonth}
          </div>
        </div>

        {/* Metric 4: Total Members */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-semibold">{t.totalMembersInSystem}</span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white font-prompt">{totalMembers}</span>
            <span className="text-xs text-slate-400 ml-2">{t.people}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> {t.newMembersThisMonth} +6
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> {t.monthlyRevenueStats}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.revenueTrendSub}</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
              2025 Revenue
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_ANALYTICS.monthlyRevenue}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `฿${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [formatTHB(val, language), language === 'en' ? 'Revenue' : 'รายได้']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E50914" strokeWidth={3} fillOpacity={1} fill="url(#revenueGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Car Type Pie Distribution */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-500" /> {t.carTypeDistribution}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{t.carDistributionSub}</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ADMIN_ANALYTICS.carTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {ADMIN_ANALYTICS.carTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend list */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
            {ADMIN_ANALYTICS.carTypeDistribution.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span>{item.name} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.recentBookingsTitle}
            </h3>
            <p className="text-[11px] text-slate-400">{t.recentBookingsSub}</p>
          </div>

          <button
            onClick={() => setCurrentView('admin-bookings')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            {t.viewAllBookingsBtn} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3 rounded-l-xl">{t.bookingId}</th>
                <th className="p-3">{t.tenant}</th>
                <th className="p-3">{t.rentedCar}</th>
                <th className="p-3">{t.rentalDates}</th>
                <th className="p-3">{t.totalPriceLabel}</th>
                <th className="p-3">{t.status}</th>
                <th className="p-3 rounded-r-xl text-right">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.slice(0, 5).map((b) => {
                const badge = getBookingStatusBadge(b.status, language);
                return (
                  <tr key={b.booking_id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-blue-400">{b.booking_id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{b.user_name}</div>
                      <div className="text-[10px] text-slate-400">{b.user_phone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{b.car_name}</div>
                      <div className="text-[10px] text-slate-400">{b.car_plate}</div>
                    </td>
                    <td className="p-3">
                      {b.start_date} {language === 'en' ? 'to' : 'ถึง'} {b.end_date}
                    </td>
                    <td className="p-3 font-bold text-white">{formatTHB(b.total_price, language)}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {b.status === 'รอยืนยัน' ? (
                        <button
                          onClick={() => updateBookingStatus(b.booking_id, 'ยืนยันแล้ว')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
                        >
                          {t.approveBookingBtn}
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentView('admin-bookings')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px]"
                        >
                          {t.detailsBtn}
                        </button>
                      )}
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

