import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTHB, formatThaiDate, getBookingStatusBadge } from '../../utils/formatters';
import { Calendar, Clock, Eye, AlertCircle, CheckCircle2, XCircle, FileText, ExternalLink } from 'lucide-react';

export const MyBookingsPage = () => {
  const { bookings, currentUser, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState('ทั้งหมด');
  const [selectedSlipModal, setSelectedSlipModal] = useState(null);

  // Filter user bookings by current logged in user (or display all if guest demo)
  const userBookings = currentUser 
    ? bookings.filter(b => b.user_email === currentUser.email || b.user_id === currentUser.user_id)
    : bookings;

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'ทั้งหมด') return true;
    return b.status === activeTab;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Title */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider">
          <Calendar className="w-4 h-4" /> Customer Portal
        </div>
        <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
          รายการจองของฉัน / ประวัติการเช่า
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ตรวจสอบสถานะการจอง ดูหลักฐานสลิป หรือยกเลิกคำขอเช่ารถ
        </p>
      </div>

      {/* Filter Tabs - Matching Wireframe 8 */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {['ทั้งหมด', 'รอยืนยัน', 'ยืนยันแล้ว', 'กำลังใช้งาน', 'คืนรถแล้ว', 'ยกเลิก'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Booking List Cards */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const badge = getBookingStatusBadge(b.status);
            return (
              <div
                key={b.booking_id}
                className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                
                {/* Left: Car Image & Info */}
                <div className="flex gap-4 items-center">
                  <img
                    src={b.car_image}
                    alt={b.car_name}
                    className="w-28 h-20 object-cover rounded-2xl border border-slate-800 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-red-400 font-semibold">{b.booking_id}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{b.car_name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>ทะเบียน: {b.car_plate || '-'}</span>
                      <span>•</span>
                      <span>{formatThaiDate(b.start_date)} – {formatThaiDate(b.end_date)} ({b.total_days} วัน)</span>
                    </p>
                  </div>
                </div>

                {/* Middle & Right: Pricing & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400">ราคารวมทั้งสิ้น</span>
                    <p className="text-xl font-extrabold text-red-500 font-prompt">{formatTHB(b.total_price)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Slip Button */}
                    {b.payment_slip && (
                      <button
                        onClick={() => setSelectedSlipModal(b)}
                        className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                        title="ดูสลิปชำระเงิน"
                      >
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="hidden sm:inline">ดูสลิป</span>
                      </button>
                    )}

                    {/* Cancel Action if pending */}
                    {(b.status === 'รอยืนยัน' || b.status === 'รอชำระเงิน') && (
                      <button
                        onClick={() => cancelBooking(b.booking_id)}
                        className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl transition"
                      >
                        ยกเลิกการจอง
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800 space-y-3 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">ไม่พบประวัติการจอง</h3>
          <p className="text-xs text-slate-400">คุณยังไม่มีรายการเช่ารถในหมวดหมู่นี้</p>
        </div>
      )}

      {/* Slip Modal Popup */}
      {selectedSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-slide-down">
            <button
              onClick={() => setSelectedSlipModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            
            <h3 className="text-base font-bold text-white">หลักฐานการโอนเงิน (Slip)</h3>
            <p className="text-xs text-slate-400">รหัสจอง: {selectedSlipModal.booking_id}</p>

            <img
              src={selectedSlipModal.payment_slip}
              alt="Payment Slip"
              className="w-full h-80 object-cover rounded-2xl border border-slate-800"
            />

            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span>ยอดโอน: <strong className="text-red-500 font-bold">{formatTHB(selectedSlipModal.total_price)}</strong></span>
              <span>วิธีชำระ: {selectedSlipModal.payment_method}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
