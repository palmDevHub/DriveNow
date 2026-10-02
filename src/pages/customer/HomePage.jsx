import React from 'react';
import { useApp } from '../../context/AppContext';
import { CarCard } from '../../components/CarCard';
import { CarFilter } from '../../components/CarFilter';
import { 
  Car, 
  Search, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Star, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export const HomePage = () => {
  const { cars, setCurrentView, setSearchFilter, handleSelectCarForBooking } = useApp();

  // Featured / Popular cars (Top 4)
  const popularCars = cars.slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
          alt="DriveNow Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105"
        />

        <div className="relative z-20 max-w-4xl px-6 py-16 sm:px-12 sm:py-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> บริการจองรถเช่าออนไลน์อันดับ 1 ในไทย
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight font-prompt">
            เช่ารถง่ายๆ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600">
              เดินทางได้ทุกที่
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl font-kanit font-light leading-relaxed">
            รถใหม่คุณภาพสูง ตรวจเช็คสภาพทุกคัน ประกันภัยชั้น 1 ครอบคลุม ราคาสุทธิไม่มีค่าใช้จ่ายแอบแฝง ส่งรถฟรีตรงถึงหน้าบ้าน
          </p>

          {/* Quick Filter Component embedded in Hero */}
          <div className="pt-4">
            <CarFilter />
          </div>
        </div>
      </section>

      {/* Popular Cars Section ("รถยอดนิยม") - Matching wireframe 1 */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500">
              <TrendingUp className="w-4 h-4" /> Popular Rentals
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-prompt mt-1">
              รถยอดนิยมแนะนำ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">เลือกรถที่ตอบโจทย์การเดินทางของคุณได้ทันที</p>
          </div>

          <button
            onClick={() => setCurrentView('cars')}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition"
          >
            <span>ดูรถทั้งหมด ({cars.length} คัน)</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCars.map((car) => (
            <CarCard key={car.car_id} car={car} />
          ))}
        </div>
      </section>

      {/* How It Works Section (ขั้นตอนการเช่ารถง่ายๆ) */}
      <section className="bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-800/80 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-prompt">
            ขั้นตอนการเช่ารถง่ายๆ ใน 3 นาที
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">สะดวกรวดเร็ว ไม่ต้องใช้เอกสารยุ่งยาก</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-center relative group hover:border-red-500/50 transition">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h3 className="text-base font-bold text-white">ค้นหารถ & เลือกระยะเวลา</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              เลือกรถรุ่นที่ต้องการ ระบุวันเริ่มเช่าและวันคืนรถ เพื่อคำนวณราคารายวันตามจริง
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-center relative group hover:border-red-500/50 transition">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h3 className="text-base font-bold text-white">ยืนยันการจอง & ชำระเงิน</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              กรอกข้อมูลผู้เช่า โอนเงินผ่าน PromptPay / QR Code และแนบสลิปผ่านระบบได้ทันที
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-center relative group hover:border-red-500/50 transition">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h3 className="text-base font-bold text-white">รับรถ & ออกเดินทาง</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              พนักงานจัดส่งรถถึงจุดนัดหมายหรือรับรถได้ที่สาขา พร้อมออกเดินทางได้อย่างอุ่นใจ
            </p>
          </div>

        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-prompt">
            เสียงตอบรับจากผู้ใช้งานจริง
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">คะแนนประเมินความพึงพอใจเฉลี่ย 4.9/5 ดาว</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "รถสะอาดมาก ส่งรถตรงเวลาเป๊ะ Toyota Altis ขับประหยัดน้ำมันมาก แอดมินตอบแชทไวและบริการเป็นกันเองสุดๆ ครับ"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-white">คุณพงศกร J.</h4>
                <p className="text-[10px] text-slate-500">เช่า Corolla Altis (3 วัน)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "จอง Civic e:HEV ไปเที่ยวเชียงใหม่กับเพื่อนๆ ประทับใจระบบจองหน้าเว็บง่ายมาก โอนผ่าน PromptPay สลิปผ่านอนุมัติไวมากค่ะ"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-white">คุณธันวา S.</h4>
                <p className="text-[10px] text-slate-500">เช่า Honda Civic (2 วัน)</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "เช่า Fortuner ไปเที่ยวต่างจังหวัดกับครอบครัว 7 ที่นั่งกว้างสบาย รถใหม่เพิ่งวิ่งไปหมื่นโล ประกันครบ สบายใจตลอดทริป"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-white">คุณอนันต์ K.</h4>
                <p className="text-[10px] text-slate-500">เช่า Toyota Fortuner (5 วัน)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
