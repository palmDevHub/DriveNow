import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTHB, formatThaiDate, getBookingStatusBadge } from '../../utils/formatters';
import { Calendar, Eye, CheckCircle, Clock, XCircle, Search, FileText } from 'lucide-react';

export const AdminBookingsPage = () => {
  const { bookings, updateBookingStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
  const [keyword, setKeyword] = useState('');
  const [viewSlipModal, setViewSlipModal] = useState(null);

  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'ทั้งหมด' && b.status !== statusFilter) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      return (
        b.booking_id.toLowerCase().includes(kw) ||
        b.user_name.toLowerCase().includes(kw) ||
        b.user_phone.includes(kw) ||
        b.car_name.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar - Matching Wireframe 13 */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider">
          <Calendar className="w-4 h-4" /> Rental Bookings Manager
        </div>
        <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
          จัดการรายการจองรถ (Manage Bookings)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ตรวจสอบสลิปการโอนเงิน อนุมัติการจอง เปลี่ยนสถานะการคืนรถ และยกเลิกคำขอ
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหาตามรหัสจอง ชื่อผู้เช่า เบอร์โทร หรือ รุ่นรถ..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ทั้งหมด', 'รอยืนยัน', 'ยืนยันแล้ว', 'กำลังใช้งาน', 'คืนรถแล้ว', 'ยกเลิก'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition ${
                statusFilter === st
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">รหัสจอง</th>
                <th className="p-4">ผู้เช่ารถ</th>
                <th className="p-4">รถที่จอง</th>
                <th className="p-4">ระยะเวลาเช่า</th>
                <th className="p-4">ยอดชำระ</th>
                <th className="p-4">สลิป</th>
                <th className="p-4">สถานะการจอง</th>
                <th className="p-4 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.map((b) => {
                const badge = getBookingStatusBadge(b.status);
                return (
                  <tr key={b.booking_id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-red-400">{b.booking_id}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{b.user_name}</div>
                      <div className="text-[10px] text-slate-400">{b.user_email} • {b.user_phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{b.car_name}</div>
                      <div className="text-[10px] text-slate-400">{b.car_plate}</div>
                    </td>
                    <td className="p-4">
                      <div>{formatThaiDate(b.start_date)} - {formatThaiDate(b.end_date)}</div>
                      <div className="text-[10px] text-slate-400 font-bold">{b.total_days} วัน</div>
                    </td>
                    <td className="p-4 font-extrabold text-red-500 font-prompt text-sm">
                      {formatTHB(b.total_price)}
                    </td>
                    <td className="p-4">
                      {b.payment_slip ? (
                        <button
                          onClick={() => setViewSlipModal(b)}
                          className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-[10px] flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> ดูสลิป
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.booking_id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-white rounded-lg text-xs focus:border-red-500 focus:outline-none cursor-pointer font-medium"
                      >
                        <option value="รอชำระเงิน">รอชำระเงิน</option>
                        <option value="รอยืนยัน">รอยืนยันสลิป</option>
                        <option value="ยืนยันแล้ว">อนุมัติ (ยืนยันแล้ว)</option>
                        <option value="กำลังใช้งาน">กำลังใช้งานรถ</option>
                        <option value="คืนรถแล้ว">คืนรถเรียบร้อยแล้ว</option>
                        <option value="ยกเลิก">ยกเลิกการจอง</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Slip Modal Popup */}
      {viewSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-slide-down">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">หลักฐานสลิปการโอนเงิน</h3>
              <button onClick={() => setViewSlipModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-300">รหัสจอง: <strong className="text-red-400 font-mono">{viewSlipModal.booking_id}</strong></p>
              <p className="text-slate-300">ผู้โอน: {viewSlipModal.user_name} ({viewSlipModal.user_phone})</p>
              <p className="text-slate-300">ยอดเงิน: <strong className="text-red-500 text-sm font-bold">{formatTHB(viewSlipModal.total_price)}</strong></p>
            </div>

            <img
              src={viewSlipModal.payment_slip}
              alt="Slip"
              className="w-full h-80 object-cover rounded-2xl border border-slate-800"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  updateBookingStatus(viewSlipModal.booking_id, 'ยืนยันแล้ว');
                  setViewSlipModal(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle className="w-4 h-4" /> อนุมัติการจองสลิปนี้
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
