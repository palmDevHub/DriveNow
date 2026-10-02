import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTHB, calculateDays, getCarStatusBadge } from '../../utils/formatters';
import { 
  Car, 
  Calendar, 
  Users, 
  Fuel, 
  Gauge, 
  ShieldCheck, 
  Tag, 
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Sparkles,
  MapPin
} from 'lucide-react';

export const CarDetailPage = () => {
  const { selectedCar, cars, setCurrentView, setBookingDraft, createBooking } = useApp();

  // Fallback if no car selected
  const car = selectedCar || cars[0];

  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]
  );

  const statusInfo = getCarStatusBadge(car.status);
  const isAvailable = car.status === 'ว่าง' || car.status === 'available';

  const totalDays = calculateDays(startDate, endDate);
  const totalPrice = car.price_per_day * totalDays;

  const handleProceedToCheckout = () => {
    setBookingDraft({
      car: car,
      startDate: startDate,
      endDate: endDate,
      totalDays: totalDays,
      totalPrice: totalPrice
    });
    setCurrentView('checkout');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('cars')}
        className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white rounded-xl flex items-center gap-2 transition"
      >
        <ArrowLeft className="w-4 h-4" /> ย้อนกลับไปค้นหารถ
      </button>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Car Image & Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Photo Card */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full border backdrop-blur-md ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                {statusInfo.text}
              </span>
              <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-950/80 text-white border border-slate-700 backdrop-blur-md">
                {car.type}
              </span>
            </div>
          </div>

          {/* Specs & Description Card */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">{car.brand}</span>
              <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
                {car.model}
              </h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {car.description || 'รถเช่าสภาพเยี่ยม ผ่านการตรวจเช็คระบบความปลอดภัยและทำความสะอาดฆ่าเชื้อ 100% ก่อนส่งมอบ'}
              </p>
            </div>

            {/* Detailed Specs Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">รายละเอียดและสเปกรถ</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">ยี่ห้อรถ</span>
                  <p className="font-bold text-white">{car.brand}</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">ปีที่ผลิต</span>
                  <p className="font-bold text-white">{car.year} </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">จำนวนที่นั่ง</span>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-red-400" /> {car.seats} ที่นั่ง
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">ระบบส่งกำลัง</span>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-red-400" /> {car.transmission}
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">ประเภทเชื้อเพลิง</span>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-red-400" /> {car.fuel}
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">ทะเบียนรถ</span>
                  <p className="font-bold text-white">{car.plate_number || 'กข-XXXX'}</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 col-span-2">
                  <span className="text-slate-400 text-[10px]">ประกันภัย</span>
                  <p className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> คุ้มครองชั้น 1 ครบวงจร
                  </p>
                </div>
              </div>
            </div>

            {/* Included Extras */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">บริการที่รวมในราคานี้แล้ว</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ฟรีบริการช่วยเหลือฉุกเฉิน 24 ชั่วโมง</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ฟรีน้ำมันเต็มถังในวันรับรถ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ฟรีบริการจัดส่งรถฟรีระยะทาง 20 กม.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ไม่มีจำกัดระยะทาง (Unlimited Mileage)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Booking Widget Box - Matching wireframe 5 right panel */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-slate-900/95 rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-6">
            
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase">ราคาเช่าต่อวัน</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-red-500 font-prompt">
                  {formatTHB(car.price_per_day)}
                </span>
                <span className="text-xs text-slate-400">/วัน</span>
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-500" /> เลือกระยะเวลาเช่า
              </h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">วันเริ่มเช่า</label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">วันคืนรถ</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Price Summary Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>ระยะเวลาเช่า:</span>
                <span className="font-bold text-white">{totalDays} วัน</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>อัตราค่าเช่า ({formatTHB(car.price_per_day)} × {totalDays} วัน):</span>
                <span>{formatTHB(totalPrice)}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                <span className="font-bold text-white">ราคารวมทั้งสิ้น:</span>
                <span className="text-xl font-extrabold text-red-500 font-prompt">{formatTHB(totalPrice)}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              disabled={!isAvailable}
              onClick={handleProceedToCheckout}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                isAvailable
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-950/60'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{isAvailable ? 'ดำเนินการจองรถ' : 'รถคันนี้ไม่พร้อมให้เช่าในขณะนี้'}</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              * สามารถยกเลิกการจองได้ฟรีก่อนวันเริ่มเช่า 24 ชั่วโมง
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};
