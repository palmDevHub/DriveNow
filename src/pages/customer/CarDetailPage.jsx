import React, { useState, useEffect } from 'react';
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
  MapPin,
  Leaf,
  BatteryCharging
} from 'lucide-react';

function useCountUp(endValue, duration = 800) {
  const [count, setCount] = useState(endValue);
  useEffect(() => {
    let startTime = null;
    const startValue = count;
    if (startValue === endValue) return;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + (endValue - startValue) * easeProgress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [endValue]);
  return count;
}
const provincePrices = [
  { id: 'songkhla', name: 'สงขลา - หาดใหญ่', price: 1000 },
  { id: 'phatthalung', name: 'พัทลุง', price: 1050 },
  { id: 'satun', name: 'สตูล', price: 1050 },
  { id: 'trang', name: 'ตรัง', price: 1100 },
  { id: 'pattani', name: 'ปัตตานี', price: 1100 },
  { id: 'nakhon', name: 'นครศรี', price: 1150 },
  { id: 'krabi', name: 'กระบี่', price: 1250 },
  { id: 'surat', name: 'สุราษฎร์', price: 1300 },
  { id: 'phuket', name: 'ภูเก็ต', price: 1300 },
];

export const CarDetailPage = () => {
  const { selectedCar, cars, setCurrentView, setBookingDraft, createBooking, t, language } = useApp();
  const isEn = language === 'en';

  // Fallback if no car selected
  const car = selectedCar || cars[0];

  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]
  );

  const statusInfo = getCarStatusBadge(car.status, language);
  const isAvailable = car.status === 'ว่าง' || car.status === 'available';

  const [selectedProvinceId, setSelectedProvinceId] = useState(
    car.vehicle_type === 'Car' ? provincePrices[0].id : ''
  );
  
  const selectedProvince = provincePrices.find(p => p.id === selectedProvinceId);
  const effectivePricePerDay = car.vehicle_type === 'Car' && selectedProvince 
    ? selectedProvince.price 
    : car.price_per_day;

  const totalDays = calculateDays(startDate, endDate);
  const rentalPrice = effectivePricePerDay * totalDays;
  const deposit = 5000;
  const totalPrice = rentalPrice + deposit;
  const animatedTotalPrice = useCountUp(totalPrice);

  const [evDistance, setEvDistance] = useState(500);
  const evSavings = Math.floor(evDistance * 2.5); // Estimate 2.5 THB saved per KM

  // 3D Simulation States
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [zoomedHotspot, setZoomedHotspot] = useState(null);

  const hotspots = [
    { id: 1, x: 20, y: 45, label: '360° Camera', desc: isEn ? 'High resolution surround view' : 'กล้องมองรอบคันความละเอียดสูง', fullDesc: isEn ? 'Experience unparalleled safety with our 4-camera 360° system, providing a birds-eye view for perfect parking every time.' : 'มั่นใจทุกการจอดด้วยระบบกล้องรอบคัน 4 ตัว ให้มุมมองแบบ 360 องศา ชัดเจนระดับ HD' },
    { id: 2, x: 50, y: 35, label: 'Sunroof', desc: isEn ? 'Panoramic Sunroof' : 'หลังคาซันรูฟแบบพาโนรามา', fullDesc: isEn ? 'Enjoy the journey with a full-width panoramic sunroof that brings natural light and fresh air into the cabin.' : 'เปิดมุมมองใหม่ด้วยหลังคากระจก Panoramic Sunroof บานใหญ่ ให้แสงธรรมชาติและอากาศบริสุทธิ์' },
    { id: 3, x: 85, y: 50, label: 'Trunk', desc: isEn ? 'Power Tailgate' : 'ฝากระโปรงท้ายไฟฟ้า', fullDesc: isEn ? 'Convenient hands-free power tailgate with kick sensor and spacious cargo area.' : 'สะดวกสบายด้วยระบบเปิด-ปิดฝากระโปรงท้ายอัตโนมัติ พร้อมระบบป้องกันการหนีบและเซ็นเซอร์เท้า' }
  ];

  const activeSpotData = hotspots.find(h => h.id === zoomedHotspot);

  const handleProceedToCheckout = () => {
    setBookingDraft({
      car: car,
      startDate: startDate,
      endDate: endDate,
      totalDays: totalDays,
      rentalPrice: rentalPrice,
      deposit: deposit,
      totalPrice: totalPrice,
      provinceName: selectedProvince?.name
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
        <ArrowLeft className="w-4 h-4" /> {isEn ? 'Back to Fleet Search' : 'ย้อนกลับไปค้นหารถ'}
      </button>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Car Image & Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Photo Card */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
            
            {/* Click outside to unzoom */}
            {activeSpotData && (
              <div className="absolute inset-0 z-30 cursor-zoom-out" onClick={() => setZoomedHotspot(null)}></div>
            )}

            {/* Scaling Wrapper */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                transformOrigin: activeSpotData ? `${activeSpotData.x}% ${activeSpotData.y}%` : 'center',
                transform: activeSpotData ? 'scale(2.5)' : 'scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
              
              {/* Interactive Hotspots Simulation */}
              {hotspots.map(spot => (
                <div key={spot.id} className={`absolute z-20 ${zoomedHotspot && zoomedHotspot !== spot.id ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} style={{ top: `${spot.y}%`, left: `${spot.x}%` }}>
                  <button 
                    onMouseEnter={() => setActiveHotspot(spot.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    onClick={(e) => { e.stopPropagation(); setZoomedHotspot(zoomedHotspot === spot.id ? null : spot.id); }}
                    className={`w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] flex items-center justify-center ${!zoomedHotspot ? 'animate-pulse' : ''} hover:animate-none hover:scale-125 transition-transform cursor-pointer`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </button>
                  
                  {/* Hover Tooltip (hidden when zoomed) */}
                  {activeHotspot === spot.id && !zoomedHotspot && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 bg-slate-900/95 backdrop-blur-md text-white text-center p-2.5 rounded-xl border border-blue-500/50 shadow-2xl pointer-events-none z-30 transform transition-all">
                      <p className="text-[11px] font-bold text-blue-400">{spot.label}</p>
                      <p className="text-[9px] text-slate-300 mt-0.5 leading-tight">{spot.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Spec Panel overlay when zoomed */}
            {activeSpotData && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl border border-blue-500/50 shadow-[0_10px_30px_rgba(220,38,38,0.2)] z-40 animate-slide-up flex gap-4 items-center">
                 <div className="flex-1 space-y-1">
                   <h4 className="text-blue-400 font-bold text-sm sm:text-base flex items-center gap-2">
                     <Sparkles className="w-4 h-4" /> {activeSpotData.label}
                   </h4>
                   <p className="text-white text-[10px] sm:text-xs leading-relaxed">{activeSpotData.fullDesc}</p>
                 </div>
                 <button onClick={() => setZoomedHotspot(null)} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300 shrink-0">
                   <ArrowLeft className="w-4 h-4" />
                 </button>
              </div>
            )}

            {/* Badges */}
            <div className={`absolute top-4 left-4 flex gap-2 transition-opacity duration-300 pointer-events-none z-10 ${zoomedHotspot ? 'opacity-0' : 'opacity-100'}`}>
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
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{car.brand}</span>
              <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
                {car.model}
              </h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {car.description || (isEn ? 'Excellent condition vehicle, 100% safety checked and sanitized prior to delivery.' : 'รถเช่าสภาพเยี่ยม ผ่านการตรวจเช็คระบบความปลอดภัยและทำความสะอาดฆ่าเชื้อ 100% ก่อนส่งมอบ')}
              </p>
            </div>

            {/* Detailed Specs Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isEn ? 'Specifications & Details' : 'รายละเอียดและสเปกรถ'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">{isEn ? 'Brand' : 'ยี่ห้อรถ'}</span>
                  <p className="font-bold text-white">{car.brand}</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">{t.year}</span>
                  <p className="font-bold text-white">{car.year} </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">{t.seats}</span>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> {car.seats} {t.seats}
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">{t.transmission}</span>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-blue-400" /> {car.transmission}
                  </p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">{t.fuel}</span>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-blue-400" /> {car.fuel}
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 col-span-2">
                  <span className="text-slate-400 text-[10px]">{isEn ? 'Insurance' : 'ประกันภัย'}</span>
                  <p className="font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {isEn ? 'Full Class 1 Protection' : 'คุ้มครองชั้น 1 ครบวงจร'}
                  </p>
                </div>
              </div>
            </div>

            {/* Included Extras */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isEn ? 'Services Included' : 'บริการที่รวมในราคานี้แล้ว'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Free 24/7 Emergency Assistance' : 'ฟรีบริการช่วยเหลือฉุกเฉิน 24 ชั่วโมง'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Free Full Tank Fuel on Pick Up' : 'ฟรีน้ำมันเต็มถังในวันรับรถ'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Free Delivery within 20 KM' : 'ฟรีบริการจัดส่งรถฟรีระยะทาง 20 กม.'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Unlimited Mileage' : 'ไม่มีจำกัดระยะทาง (Unlimited Mileage)'}</span>
                </div>
              </div>
            </div>

            {/* Service Areas & Pricing */}
            {car.vehicle_type === 'Car' && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  📍✨ {isEn ? 'Car Rental Prices by Province (Cars Only)' : 'ค่าเช่ารถแต่ละจังหวัด (สำหรับรถยนต์เท่านั้น)'} ✨🚘
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 สงขลา - หาดใหญ่ 🏝️</span>
                    <span className="font-bold text-blue-400">1,000 บาท/วัน</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 พัทลุง 🌿</span>
                    <span className="font-bold text-blue-400">1,050 บาท/วัน</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 สตูล 🌊</span>
                    <span className="font-bold text-blue-400">1,050 บาท/วัน</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 ตรัง 🏖️</span>
                    <span className="font-bold text-blue-400">1,100 บาท/วัน</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 ปัตตานี 🌙</span>
                    <span className="font-bold text-blue-400">1,100 บาท/วัน</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 นครศรี 🛕</span>
                    <span className="font-bold text-blue-400">1,150 บาท/วัน</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 กระบี่ ⛰️</span>
                    <span className="font-bold text-blue-400">1,250 บาท/วัน</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 สุราษฎร์ 🏝️</span>
                    <span className="font-bold text-blue-400">1,300 บาท/วัน</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">💥 ภูเก็ต 🌅</span>
                    <span className="font-bold text-blue-400">1,300 บาท/วัน</span>
                  </div>
                </div>
              </div>
            )}

            {/* EV Fuel Saver Calculator */}
            {(car.fuel === 'EV' || car.type === 'EV') && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {isEn ? 'EV Fuel Savings Calculator' : 'เครื่องคำนวณความประหยัด EV'}
                  </h3>
                </div>
                <div className="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-900/30 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] text-emerald-400/70 font-semibold">{isEn ? 'Estimated Trip Distance' : 'ระยะทางทริปโดยประมาณ'}</label>
                      <div className="text-xl font-extrabold text-white font-prompt">{evDistance} <span className="text-sm text-slate-400">km</span></div>
                    </div>
                    <div className="text-right space-y-1">
                      <label className="text-[10px] text-emerald-400/70 font-semibold">{isEn ? 'You Save (vs Gas)' : 'ประหยัดค่าน้ำมันได้ถึง'}</label>
                      <div className="text-2xl font-extrabold text-emerald-400 font-prompt">~{formatTHB(evSavings, language)}</div>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="2000" 
                    step="50" 
                    value={evDistance}
                    onChange={(e) => setEvDistance(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[9px] text-slate-500 text-center">
                    {isEn ? '* Calculation based on average fuel price of 35 THB/L vs EV charging cost' : '* คำนวณจากราคาน้ำมันเฉลี่ย 35 บาท/ลิตร เทียบกับค่าชาร์จไฟฟ้า'}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Booking Widget Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-slate-900/95 rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-6">
            
            <div className="flex items-baseline justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase">{t.pricePerDay}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-blue-500 font-prompt">
                  {formatTHB(effectivePricePerDay, language)}
                </span>
                <span className="text-xs text-slate-400">{t.perDay}</span>
              </div>
            </div>

            {/* Province Selector for Cars */}
            {car.vehicle_type === 'Car' && (
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> {isEn ? 'Select Province' : 'เลือกจังหวัดที่ต้องการใช้งาน'}
                </label>
                <select
                  value={selectedProvinceId}
                  onChange={(e) => setSelectedProvinceId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white outline-none cursor-pointer"
                >
                  {provincePrices.map(prov => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range Selector */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" /> {isEn ? 'Select Rental Duration' : 'เลือกระยะเวลาเช่า'}
              </h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">{t.startDateLabel}</label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">{t.endDateLabel}</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Duration & Price Summary Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{t.durationLabel}:</span>
                <span className="font-bold text-white">{totalDays} {t.daysUnit}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isEn ? 'Rental Rate' : 'อัตราค่าเช่า'} ({formatTHB(effectivePricePerDay, language)} × {totalDays} {t.daysUnit}):</span>
                <span>{formatTHB(rentalPrice, language)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isEn ? 'Security Deposit (Refundable)' : 'เงินมัดจำ (คืนเมื่อส่งรถ)'}:</span>
                <span>{formatTHB(deposit, language)}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                <span className="font-bold text-white">{t.totalPriceLabel}:</span>
                <span className="text-xl font-extrabold text-blue-500 font-prompt transition-all duration-300 transform scale-110 origin-right">
                  {formatTHB(animatedTotalPrice, language)}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              disabled={!isAvailable}
              onClick={handleProceedToCheckout}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                isAvailable
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-950/60'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{isAvailable ? t.bookNow : t.notAvailable}</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              {isEn ? '* Free cancellation up to 24 hours before rental start.' : '* สามารถยกเลิกการจองได้ฟรีก่อนวันเริ่มเช่า 24 ชั่วโมง'}
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};

