import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTHB, formatDate } from '../../utils/formatters';
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
  FileCheck,
  X,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const CheckoutPage = () => {
  const { bookingDraft, currentUser, createBooking, setCurrentView, showToast, t, language } = useApp();
  const isEn = language === 'en';

  const car = bookingDraft.car;

  // Step state: 1 = Form & Confirmation, 2 = Payment & Slip, 3 = Complete Success
  const [step, setStep] = useState(1);

  // Scroll to top automatically whenever step changes (especially step 3 after booking completion)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Customer form state
  const [formData, setFormData] = useState({
    customerName: currentUser ? currentUser.name : (isEn ? 'Pongsakorn Jaidee' : 'นายพงศกร ใจดี'),
    customerEmail: currentUser ? currentUser.email : 'palm@example.com',
    customerPhone: currentUser ? currentUser.phone : '081-234-5678',
    driverLicense: currentUser ? (currentUser.driver_license || 'DL-99182347') : 'DL-99182347',
    paymentMethod: isEn ? 'Bank Transfer (PromptPay / QR Code)' : 'โอนเงิน (PromptPay / QR Code)',
    paymentSlip: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80',
    idCardImage: '',
    driverLicenseImage: ''
  });

  const [createdBookingResult, setCreatedBookingResult] = useState(null);

  if (!car) {
    return (
      <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 space-y-4 max-w-md mx-auto my-12">
        <Car className="w-12 h-12 text-blue-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">{t.notFoundTitle}</h3>
        <p className="text-xs text-slate-400">{t.notFoundDesc}</p>
        <button
          onClick={() => setCurrentView('cars')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
        >
          {t.backToSelectCar}
        </button>
      </div>
    );
  }

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.customerEmail) {
      showToast(isEn ? 'Please fill in all renter details' : 'กรุณากรอกข้อมูลผู้เช่าให้ครบถ้วน', 'warning');
      return;
    }
    
    // Validate phone length
    const phoneVal = formData.customerPhone.replace(/[^0-9]/g, '');
    if (phoneVal.length < 9 || phoneVal.length > 10) {
      showToast(isEn ? 'Phone number must be 9-10 digits' : 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลักเท่านั้น', 'warning');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmitPayment = () => {
    if (!formData.paymentSlip || !formData.idCardImage || !formData.driverLicenseImage) {
      showToast(isEn ? 'Please upload all required documents (Slip, ID Card, Driver License)' : 'กรุณาอัปโหลดเอกสารให้ครบถ้วน (สลิป, บัตรประชาชน, ใบขับขี่)', 'warning');
      return;
    }

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
      paymentSlip: formData.paymentSlip,
      idCardImage: formData.idCardImage,
      driverLicenseImage: formData.driverLicenseImage
    });

    setCreatedBookingResult(newBooking);
    setStep(3);

    // Explicitly scroll to top smoothly after completing booking
    window.scrollTo({ top: 0, behavior: 'smooth' });

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
      
      {/* Checkout Progress Stepper */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-semibold">
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              1
            </div>
            <span className={step >= 1 ? 'text-white font-bold' : 'text-slate-500'}>{t.step1Progress}</span>
          </div>

          <div className={`h-0.5 flex-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-800'}`}></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              2
            </div>
            <span className={step >= 2 ? 'text-white font-bold' : 'text-slate-500'}>{t.step2Progress}</span>
          </div>

          <div className={`h-0.5 flex-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-800'}`}></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </div>
            <span className={step >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{t.step3Progress}</span>
          </div>

        </div>
      </div>

      {/* STEP 1: Confirmation & Customer Details */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Customer Details Form */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-white font-prompt flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> {t.tenantInfoTitle}
            </h2>

            <form onSubmit={handleNextToPayment} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">{t.fullNameLabel} <span className="text-blue-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder={isEn ? "e.g. Pongsakorn Jaidee" : "เช่น นายพงศกร ใจดี"}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">{t.phoneLabel} <span className="text-blue-500">*</span></label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 10) {
                        setFormData({ ...formData, customerPhone: val });
                      }
                    }}
                    placeholder="081-234-5678"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">{t.emailLabel} <span className="text-blue-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="palm@example.com"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">{t.licenseLabel}</label>
                <input
                  type="text"
                  value={formData.driverLicense}
                  onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                  placeholder="DL-99182347"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentView('car-detail')}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> {t.backBtn}
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950/50"
                >
                  <span>{t.confirmAndPayBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Booking Summary Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                {t.summaryTitle}
              </h3>

              <div className="flex gap-4">
                <img src={car.image} alt={car.model} className="w-24 h-16 object-cover rounded-xl border border-slate-800" />
                <div>
                  <span className="text-[10px] text-blue-500 font-bold uppercase">{car.brand}</span>
                  <h4 className="text-sm font-bold text-white">{car.model}</h4>
                  <p className="text-[11px] text-slate-400">{car.seats} {t.seats} • {car.transmission}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{t.startDateLabel}:</span>
                  <span className="text-white font-semibold">{formatDate(bookingDraft.startDate, language)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.endDateLabel}:</span>
                  <span className="text-white font-semibold">{formatDate(bookingDraft.endDate, language)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.durationLabel}:</span>
                  <span className="text-white font-semibold">{bookingDraft.totalDays} {t.daysUnit}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.rentPerDay}:</span>
                  <span>{formatTHB(car.price_per_day, language)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isEn ? 'Deposit' : 'เงินมัดจำ'}:</span>
                  <span>{formatTHB(bookingDraft.deposit || 5000, language)}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">{t.totalDueLabel}:</span>
                  <span className="text-xl font-extrabold text-blue-500 font-prompt">{formatTHB(bookingDraft.totalPrice, language)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: Payment & Slip Upload */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* QR Code & Payment Information */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-prompt flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-500" /> {t.qrPaymentTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t.scanQrNotice} <strong className="text-blue-500 font-bold text-sm">{formatTHB(bookingDraft.totalPrice, language)}</strong>
              </p>
            </div>

            {/* Simulated PromptPay QR Box */}
            <div className="bg-white p-6 rounded-3xl text-slate-900 text-center max-w-xs mx-auto space-y-3 shadow-2xl border-4 border-blue-600">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-extrabold tracking-tight text-blue-900">PromptPay</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">Car Rental Songkhla</span>
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
                <p className="font-bold text-slate-800">{t.accountName}</p>
                <p className="text-slate-600 font-mono">{t.accountNo}</p>
              </div>
            </div>

            {/* Slip Upload Input */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-500" /> {t.attachSlipTitle}
              </h3>

              <div className="bg-slate-950 p-4 rounded-2xl border border-dashed border-slate-700 text-center space-y-3">
                {formData.paymentSlip ? (
                  <div className="space-y-2">
                    <img src={formData.paymentSlip} alt="Payment Slip Preview" className="h-36 mx-auto rounded-xl border border-slate-800 object-cover" />
                    <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {t.slipAttachedSuccess}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-300">{t.clickUploadSlip}</p>
                    <p className="text-[10px] text-slate-500">JPG, PNG (max 5MB)</p>
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
                    {t.demoSlipBtn}
                  </button>
                </div>
              </div>
            </div>

            {/* Identity Verification (ID Card & Driver's License) */}
            <div className="space-y-3 pt-6 border-t border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> {isEn ? 'Identity Verification' : 'ยืนยันตัวตน'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Card Front */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-dashed border-slate-700 text-center space-y-3 relative group">
                  {formData.idCardImage ? (
                    <div className="space-y-2 relative">
                       <img src={formData.idCardImage} alt="ID Card" className="h-28 w-full object-cover rounded-xl border border-slate-800" />
                       <button
                         onClick={() => setFormData({ ...formData, idCardImage: '' })}
                         className="absolute top-2 right-2 bg-blue-600 p-1.5 rounded-full text-white shadow-lg hover:bg-blue-700 transition"
                       >
                         <X className="w-3 h-3" />
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-1 py-4">
                      <FileCheck className="w-6 h-6 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-300">{isEn ? 'Front of ID Card' : 'รูปบัตรประชาชนด้านหน้า'}</p>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          idCardImage: 'https://images.unsplash.com/photo-1633265486064-086b219458ce?auto=format&fit=crop&w=500&q=80'
                        })}
                        className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium transition"
                      >
                        {isEn ? 'Upload Demo ID' : 'ใช้รูปตัวอย่าง (Demo)'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Driver's License Front */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-dashed border-slate-700 text-center space-y-3">
                  {formData.driverLicenseImage ? (
                    <div className="space-y-2 relative">
                       <img src={formData.driverLicenseImage} alt="Driver's License" className="h-28 w-full object-cover rounded-xl border border-slate-800" />
                       <button
                         onClick={() => setFormData({ ...formData, driverLicenseImage: '' })}
                         className="absolute top-2 right-2 bg-blue-600 p-1.5 rounded-full text-white shadow-lg hover:bg-blue-700 transition"
                       >
                         <X className="w-3 h-3" />
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-1 py-4">
                      <CreditCard className="w-6 h-6 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-300">{isEn ? "Front of Driver's License" : 'รูปใบขับขี่ด้านหน้า'}</p>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          driverLicenseImage: 'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?auto=format&fit=crop&w=500&q=80'
                        })}
                        className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium transition"
                      >
                        {isEn ? 'Upload Demo License' : 'ใช้รูปตัวอย่าง (Demo)'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> {t.backBtn}
              </button>

              <button
                type="button"
                onClick={handleFinalSubmitPayment}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950/50"
              >
                <FileCheck className="w-4 h-4" />
                <span>{t.submitPaymentBtn}</span>
              </button>
            </div>

          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                {t.summaryTitle}
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{t.fullNameLabel}:</span>
                  <span className="text-white font-medium">{formData.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.phoneLabel}:</span>
                  <span className="text-white font-medium">{formData.customerPhone}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.rentedCar}:</span>
                  <span className="text-white font-medium">{car.brand} {car.model}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.durationLabel}:</span>
                  <span className="text-white font-medium">{bookingDraft.totalDays} {t.daysUnit}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isEn ? 'Deposit' : 'เงินมัดจำ'}:</span>
                  <span className="text-white font-medium">{formatTHB(bookingDraft.deposit || 5000, language)}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-white">{t.totalDueLabel}:</span>
                  <span className="text-2xl font-extrabold text-blue-500 font-prompt">{formatTHB(bookingDraft.totalPrice, language)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: Complete Success (Digital Booking Pass) */}
      {step === 3 && createdBookingResult && (
        <div className="max-w-2xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-white font-prompt">
              {t.bookingSuccessTitle}
            </h2>
            <p className="text-slate-400">
              {isEn ? 'Your digital booking pass is ready.' : 'นี่คือบัตรจองรถดิจิทัลของคุณ สามารถบันทึกรูปไว้เป็นหลักฐานได้เลย'}
            </p>
          </motion.div>

          <motion.div 
             initial={{ x: '-100vw', scale: 0.8 }}
             animate={{ x: 0, scale: 1 }}
             transition={{ type: 'spring', damping: 20, stiffness: 60, delay: 0.2 }}
             className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] p-8 sm:p-10 border-2 border-blue-500/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden"
          >
             {/* Digital Pass Decorative Elements */}
             <div className="absolute top-0 right-0 p-6 bg-blue-600 rounded-bl-[3rem] shadow-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white" />
             </div>
             <div className="absolute top-1/2 -left-6 w-12 h-12 bg-slate-950 rounded-full border-r border-slate-800"></div>
             <div className="absolute top-1/2 -right-6 w-12 h-12 bg-slate-950 rounded-full border-l border-slate-800"></div>

             <div className="flex flex-col sm:flex-row items-center gap-6">
               <motion.img 
                  src={car.image} 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
                  className="w-48 sm:w-64 h-auto object-cover rounded-2xl shadow-2xl drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] z-10"
               />
               <div className="space-y-4 z-10 text-center sm:text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-500 tracking-widest">{t.bookingId}</span>
                    <p className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">{createdBookingResult.booking_id}</p>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-prompt">{createdBookingResult.car_name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{car.seats} {t.seats} • {car.transmission}</p>
                  </div>
               </div>
             </div>

             <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-700 grid grid-cols-2 gap-y-6 gap-x-4 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">{t.startDateLabel}</span>
                  <span className="font-semibold text-white text-sm">{formatDate(createdBookingResult.start_date, language)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">{t.endDateLabel}</span>
                  <span className="font-semibold text-white text-sm">{formatDate(createdBookingResult.end_date, language)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">{t.fullNameLabel}</span>
                  <span className="font-semibold text-white text-sm">{createdBookingResult.user_name}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">{t.totalDueLabel}</span>
                  <span className="font-extrabold text-emerald-400 text-base">{formatTHB(createdBookingResult.total_price, language)}</span>
                </div>
             </div>
             
             {/* Status Badge inside pass */}
             <div className="mt-6 flex justify-center sm:justify-start">
               <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-full flex items-center gap-2">
                 <Clock className="w-4 h-4" /> {isEn ? 'Pending Verification' : 'รอยืนยันสลิปจากแอดมิน'}
               </span>
             </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
             className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <button
              onClick={() => setCurrentView('my-bookings')}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/50 transition-transform hover:scale-105"
            >
              {t.viewMyBookingsBtn}
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-transform hover:scale-105"
            >
              {t.backToHomeBtn}
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};


