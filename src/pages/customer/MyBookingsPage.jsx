import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTHB, formatDate, getBookingStatusBadge } from '../../utils/formatters';
import { Calendar, Clock, Eye, AlertCircle, CheckCircle2, XCircle, FileText, ExternalLink, Star, MessageSquare } from 'lucide-react';

export const MyBookingsPage = () => {
  const { bookings, currentUser, cancelBooking, submitReview, t, language } = useApp();
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState(isEn ? 'All' : 'ทั้งหมด');
  const [selectedSlipModal, setSelectedSlipModal] = useState(null);
  
  // Review Modal State
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Filter user bookings by current logged in user (or display all if guest demo)
  const userBookings = currentUser 
    ? bookings.filter(b => b.user_email === currentUser.email || b.user_id === currentUser.user_id)
    : bookings;

  const tabOptions = isEn 
    ? ['All', 'Pending Slip Verification', 'Approved', 'In Use', 'Returned', 'Cancelled']
    : ['ทั้งหมด', 'รอยืนยัน', 'ยืนยันแล้ว', 'กำลังใช้งาน', 'คืนรถแล้ว', 'ยกเลิก'];

  const filterMap = {
    'All': 'ทั้งหมด',
    'Pending Slip Verification': 'รอยืนยัน',
    'Approved': 'ยืนยันแล้ว',
    'In Use': 'กำลังใช้งาน',
    'Returned': 'คืนรถแล้ว',
    'Cancelled': 'ยกเลิก'
  };

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'ทั้งหมด' || activeTab === 'All') return true;
    const mappedTab = isEn ? (filterMap[activeTab] || activeTab) : activeTab;
    return b.status === mappedTab || b.status === activeTab;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Title */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
          <Calendar className="w-4 h-4" /> Customer Portal
        </div>
        <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
          {t.myBookingsTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t.myBookingsSub}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {tabOptions.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/50'
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
            const badge = getBookingStatusBadge(b.status, language);
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
                      <span className="text-[10px] font-mono text-blue-400 font-semibold">{b.booking_id}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{b.car_name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{t.plateNo} {b.car_plate || '-'}</span>
                      <span>•</span>
                      <span>{formatDate(b.start_date, language)} – {formatDate(b.end_date, language)} ({b.total_days} {t.daysUnit})</span>
                    </p>
                  </div>
                </div>

                {/* Middle & Right: Pricing & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400">{t.totalAmount}</span>
                    <p className="text-xl font-extrabold text-blue-500 font-prompt">{formatTHB(b.total_price, language)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Slip Button */}
                    {b.payment_slip && (
                      <button
                        onClick={() => setSelectedSlipModal(b)}
                        className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
                        title={t.viewSlip}
                      >
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="hidden sm:inline">{t.viewSlip}</span>
                      </button>
                    )}

                    {/* Cancel Action if pending */}
                    {(b.status === 'รอยืนยัน' || b.status === 'รอชำระเงิน') && (
                      <button
                        onClick={() => cancelBooking(b.booking_id)}
                        className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-xl transition"
                      >
                        {t.cancelBookingBtn}
                      </button>
                    )}
                    {/* Review Button if returned */}
                    {b.status === 'คืนรถแล้ว' && !b.has_reviewed && (
                      <button
                        onClick={() => { setReviewModal(b); setRating(5); setReviewText(''); }}
                        className="px-3 py-2 bg-yellow-950/40 hover:bg-yellow-900/60 border border-yellow-500/30 text-yellow-300 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                      >
                        <Star className="w-4 h-4" /> รีวิว & ให้คะแนน
                      </button>
                    )}
                    
                    {/* Reviewed Badge */}
                    {b.status === 'คืนรถแล้ว' && b.has_reviewed && (
                      <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-950/20 px-3 py-2 rounded-xl border border-yellow-500/20">
                        <CheckCircle2 className="w-4 h-4" /> รีวิวแล้ว ({b.rating} ดาว)
                      </div>
                    )}

                  </div>
                </div>
              
                {/* Stepper Timeline */}
                {b.status !== 'ยกเลิก' && (
                  <div className="w-full pt-5 mt-5 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <div className={`flex flex-col items-center gap-1.5 ${['รอยืนยัน', 'รอชำระเงิน', 'ยืนยันแล้ว', 'อนุมัติการจองแล้ว', 'กำลังใช้งาน', 'กำลังเช่า', 'คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'text-blue-500 font-bold' : 'text-slate-500'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${['รอยืนยัน', 'รอชำระเงิน', 'ยืนยันแล้ว', 'อนุมัติการจองแล้ว', 'กำลังใช้งาน', 'กำลังเช่า', 'คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-slate-800 border border-slate-700'}`}>1</div>
                        <span>{isEn ? 'Booked' : 'ชำระเงินสำเร็จ'}</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 rounded-full ${['ยืนยันแล้ว', 'อนุมัติการจองแล้ว', 'กำลังใช้งาน', 'กำลังเช่า', 'คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'bg-gradient-to-r from-blue-500 to-blue-500' : 'bg-slate-800'}`}></div>
                      
                      <div className={`flex flex-col items-center gap-1.5 ${['ยืนยันแล้ว', 'อนุมัติการจองแล้ว', 'กำลังใช้งาน', 'กำลังเช่า', 'คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'text-blue-500 font-bold' : 'text-slate-500'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${['ยืนยันแล้ว', 'อนุมัติการจองแล้ว', 'กำลังใช้งาน', 'กำลังเช่า', 'คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-slate-800 border border-slate-700'}`}>2</div>
                        <span>{isEn ? 'Waiting Pickup' : 'รอรับรถ'}</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 rounded-full ${['กำลังใช้งาน', 'กำลังเช่า', 'คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'bg-blue-500' : 'bg-slate-800'}`}></div>

                      <div className={`flex flex-col items-center gap-1.5 ${['กำลังใช้งาน', 'กำลังเช่า', 'คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'text-blue-500 font-bold' : 'text-slate-500'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${['กำลังใช้งาน', 'กำลังเช่า', 'คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-slate-800 border border-slate-700'}`}>3</div>
                        <span>{isEn ? 'Driving' : 'กำลังขับขี่'}</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 rounded-full ${['คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'bg-gradient-to-r from-blue-500 to-emerald-500' : 'bg-slate-800'}`}></div>

                      <div className={`flex flex-col items-center gap-1.5 ${['คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${['คืนรถแล้ว', 'คืนรถเรียบร้อยแล้ว'].includes(b.status) ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-slate-800 border border-slate-700'}`}><CheckCircle2 className="w-3.5 h-3.5" /></div>
                        <span>{isEn ? 'Complete' : 'คืนรถเรียบร้อย'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800 space-y-3 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">{t.noBookingsFound}</h3>
          <p className="text-xs text-slate-400">{t.noBookingsSub}</p>
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
            
            <h3 className="text-base font-bold text-white">{t.slipModalTitle}</h3>
            <p className="text-xs text-slate-400">{t.bookingId}: {selectedSlipModal.booking_id}</p>

            <img
              src={selectedSlipModal.payment_slip}
              alt="Payment Slip"
              className="w-full h-80 object-cover rounded-2xl border border-slate-800"
            />

            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span>{t.paidAmount} <strong className="text-blue-500 font-bold">{formatTHB(selectedSlipModal.total_price, language)}</strong></span>
              <span>{t.paymentMethodLabel} {selectedSlipModal.payment_method}</span>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Popup */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-slide-down">
            <button
              onClick={() => setReviewModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> ให้คะแนนการเช่ารถ
            </h3>
            <p className="text-xs text-slate-400">รหัสการจอง: {reviewModal.booking_id} • รถ: {reviewModal.car_name}</p>

            <div className="space-y-4 pt-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-semibold text-slate-300">ความพึงพอใจของคุณ</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        className={`w-10 h-10 ${rating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" /> ความคิดเห็นเพิ่มเติม
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="ประทับใจบริการ หรือมีอะไรแนะนำติชม พิมพ์ได้ที่นี่..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 h-28 resize-none"
                />
              </div>

              <button
                onClick={() => {
                  submitReview(reviewModal.booking_id, rating, reviewText);
                  setReviewModal(null);
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/50"
              >
                ส่งรีวิว
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


