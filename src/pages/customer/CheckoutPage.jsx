import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTHB, formatThaiDate } from '../../utils/formatters';
import { 
  CheckCircle2, 
  Car, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Upload, 
  QrCode, 
  ShieldCheck, 
  ArrowLeft,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage = () => {
  const { bookingDraft, currentUser, createBooking, setCurrentView, showToast } = useApp();

  const car = bookingDraft.car;

  // Step state: 1 = Form & Confirmation, 2 = Payment & Slip, 3 = Complete Success
  const [step, setStep] = useState(1);

  // Customer form state
  const [formData, setFormData] = useState({
    customerName: currentUser ? currentUser.name : 'นายพงศกร ใจดี',
    customerEmail: currentUser ? currentUser.email : 'palm@example.com',
    customerPhone: currentUser ? currentUser.phone : '081-234-5678',
    driverLicense: currentUser ? (currentUser.driver_license || 'DL-99182347') : 'DL-99182347',
    paymentMethod: 'โอนเงิน (PromptPay / QR Code)',
    paymentSlip: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'
  });

  const [createdBookingResult, setCreatedBookingResult] = useState(null);

  if (!car) {
    return (
      <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 space-y-4 max-w-md mx-auto my-12">
        <Car className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">ไม่พบข้อมูลการจอง</h3>
        <p className="text-xs text-slate-400">กรุณาเลือกรถที่คุณต้องการจากหน้ารายการรถก่อนดำเนินการ</p>
        <button
          onClick={() => setCurrentView('cars')}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl"
        >
          กลับไปเลือกรถ
        </button>
      </div>
    );
  }

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.customerEmail) {
      showToast('กรุณากรอกข้อมูลผู้เช่าให้ครบถ้วน', 'warning');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmitPayment = () => {
    const newBooking = createBooking({
      car: car,
      startDate: bookingDraft.startDate,
      endDate: bookingDraft.endDate,
      totalDays: bookingDraft.totalDays,
      totalPrice: bookingDraft.totalPrice,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      paymentMethod: formData.paymentMethod,
      paymentSlip: formData.paymentSlip
    });

    setCreatedBookingResult(newBooking);
    setStep(3);

    // Fire success confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Checkout Progress Stepper (Matching Wireframe 6 & 7 top progress bar) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-semibold">
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              1
            </div>
            <span className={step >= 1 ? 'text-white font-bold' : 'text-slate-500'}>ยืนยันการจอง</span>
          </div>

          <div className={`h-0.5 flex-1 mx-4 ${step >= 2 ? 'bg-red-600' : 'bg-slate-800'}`}></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              2
            </div>
            <span className={step >= 2 ? 'text-white font-bold' : 'text-slate-500'}>ชำระเงิน</span>
          </div>

          <div className={`h-0.5 flex-1 mx-4 ${step >= 3 ? 'bg-red-600' : 'bg-slate-800'}`}></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </div>
            <span className={step >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>เสร็จสิ้น</span>
          </div>

        </div>
      </div>

      {/* STEP 1: Confirmation & Customer Details (Wireframe 6) */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Customer Details Form */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-white font-prompt flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" /> ข้อมูลผู้ติดต่อ / ผู้เช่ารถ
            </h2>

            <form onSubmit={handleNextToPayment} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">ชื่อ-นามสกุล ผู้เช่า <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="เช่น นายพงศกร ใจดี"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">เบอร์โทรศัพท์ติดต่อ <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="เช่น 081-234-5678"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">อีเมล <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="เช่น palm@example.com"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">เลขที่ใบขับขี่ / เลขบัตรประชาชน</label>
                <input
                  type="text"
                  value={formData.driverLicense}
                  onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                  placeholder="เช่น DL-99182347"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentView('car-detail')}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/50"
                >
                  <span>ยืนยันข้อมูล & ชำระเงิน</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Booking Summary Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                สรุปรายการจอง
              </h3>

              <div className="flex gap-4">
                <img src={car.image} alt={car.model} className="w-24 h-16 object-cover rounded-xl border border-slate-800" />
                <div>
                  <span className="text-[10px] text-red-500 font-bold uppercase">{car.brand}</span>
                  <h4 className="text-sm font-bold text-white">{car.model}</h4>
                  <p className="text-[11px] text-slate-400">{car.seats} ที่นั่ง • {car.transmission}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>วันเริ่มเช่า:</span>
                  <span className="text-white font-semibold">{formatThaiDate(bookingDraft.startDate)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>วันคืนรถ:</span>
                  <span className="text-white font-semibold">{formatThaiDate(bookingDraft.endDate)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>ระยะเวลา:</span>
                  <span className="text-white font-semibold">{bookingDraft.totalDays} วัน</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>ค่าเช่าต่อวัน:</span>
                  <span>{formatTHB(car.price_per_day)}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">ยอดรวมที่ต้องชำระ:</span>
                  <span className="text-xl font-extrabold text-red-500 font-prompt">{formatTHB(bookingDraft.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: Payment & Slip Upload (Wireframe 7) */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* QR Code & Payment Information */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-prompt flex items-center gap-2">
                <QrCode className="w-5 h-5 text-red-500" /> ชำระเงินผ่าน QR Code / PromptPay
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                สแกน QR Code ด้านล่างเพื่อชำระเงิน ยอดชำระ: <strong className="text-red-500 font-bold text-sm">{formatTHB(bookingDraft.totalPrice)}</strong>
              </p>
            </div>

            {/* Simulated PromptPay QR Box */}
            <div className="bg-white p-6 rounded-3xl text-slate-900 text-center max-w-xs mx-auto space-y-3 shadow-2xl border-4 border-red-600">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-extrabold tracking-tight text-blue-900">PromptPay</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">DriveNow Rental</span>
              </div>
              
              {/* Generated QR Code Graphic */}
              <div className="bg-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROMPTPAY_DRIVENOW_AMOUNT_${bookingDraft.totalPrice}`}
                  alt="PromptPay QR Code"
                  className="w-44 h-44 rounded-lg shadow-sm"
                />
              </div>

              <div className="text-left text-xs space-y-1 pt-1 border-t border-slate-200">
                <p className="font-bold text-slate-800">ชื่อบัญชี: บจก. ไดรฟ์เนาว์ เรนทัล (DriveNow)</p>
                <p className="text-slate-600 font-mono">เลขบัญชี: 081-254-5678 (กสิกรไทย)</p>
              </div>
            </div>

            {/* Slip Upload Input */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-red-500" /> แนบหลักฐานการโอนเงิน (Slip)
              </h3>

              <div className="bg-slate-950 p-4 rounded-2xl border border-dashed border-slate-700 text-center space-y-3">
                {formData.paymentSlip ? (
                  <div className="space-y-2">
                    <img src={formData.paymentSlip} alt="Payment Slip Preview" className="h-36 mx-auto rounded-xl border border-slate-800 object-cover" />
                    <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> แนบหลักฐานสลิปเรียบร้อยแล้ว
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-300">คลิกอัปโหลดสลิป หรือลากไฟล์มาวาง</p>
                    <p className="text-[10px] text-slate-500">รองรับไฟล์ JPG, PNG (ขนาดไม่เกิน 5MB)</p>
                  </div>
                )}

                <div className="flex justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      paymentSlip: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'
                    })}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium"
                  >
                    ใช้สลิปทดสอบ (Demo Slip)
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
              </button>

              <button
                type="button"
                onClick={handleFinalSubmitPayment}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/50"
              >
                <FileCheck className="w-4 h-4" />
                <span>ยืนยันการชำระเงินส่งจอง</span>
              </button>
            </div>

          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                สรุปยอดชำระ
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>ผู้เช่า:</span>
                  <span className="text-white font-medium">{formData.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>เบอร์โทร:</span>
                  <span className="text-white font-medium">{formData.customerPhone}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>รถเช่า:</span>
                  <span className="text-white font-medium">{car.brand} {car.model}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>จำนวน:</span>
                  <span className="text-white font-medium">{bookingDraft.totalDays} วัน</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-white">ยอดสุทธิ:</span>
                  <span className="text-2xl font-extrabold text-red-500 font-prompt">{formatTHB(bookingDraft.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: Complete Success */}
      {step === 3 && createdBookingResult && (
        <div className="bg-slate-900/90 rounded-3xl p-8 sm:p-12 border border-emerald-500/30 text-center max-w-xl mx-auto space-y-6 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white font-prompt">
              ส่งข้อมูลการจองรถสำเร็จ!
            </h2>
            <p className="text-xs text-slate-400">
              ระบบได้รับหลักฐานการชำระเงินเรียบร้อยแล้ว รหัสการจองของคุณคือ: <strong className="text-red-400 font-mono text-sm">{createdBookingResult.booking_id}</strong>
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">รถที่จอง:</span>
              <span className="text-white font-semibold">{createdBookingResult.car_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ระยะเวลา:</span>
              <span className="text-white">{formatThaiDate(createdBookingResult.start_date)} - {formatThaiDate(createdBookingResult.end_date)} ({createdBookingResult.total_days} วัน)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ยอดรวม:</span>
              <span className="text-red-500 font-bold">{formatTHB(createdBookingResult.total_price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">สถานะ:</span>
              <span className="text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">รอยืนยันสลิปจากแอดมิน</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setCurrentView('my-bookings')}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/50"
            >
              ดูรายการจองของฉัน
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              กลับสู่หน้าแรก
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
