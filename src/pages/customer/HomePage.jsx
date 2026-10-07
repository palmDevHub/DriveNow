import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CarCard } from '../../components/CarCard';
import { CarFilter } from '../../components/CarFilter';

import { Relight } from '../../components/Relight';
import { formatTHB } from '../../utils/formatters';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  const { cars, searchFilter, setCurrentView, setSearchFilter, handleSelectCarForBooking, t, language } = useApp();
  const isEn = language === 'en';

  // Show both cars and motorcycles on the homepage
  const featuredCars = cars;
  const popularCars = featuredCars.slice(0, 8);

  return (
    <div className="space-y-12 pb-12 pt-2 sm:pt-6">
      
      {/* New Hero Banner Section */}
      <section className="relative w-full rounded-[20px] sm:rounded-[30px] overflow-hidden shadow-2xl mx-auto group">
        <motion.img 
          src="/hero-banner.jpg" 
          alt="Car Rental Hatyai Songkhla Promotion" 
          className="w-full h-auto object-cover"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
        
        {/* Facebook Floating Button on Banner */}
        <a
          href="https://www.facebook.com/profile.php?id=61567027827259&sk=reels_tab"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-10 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#1877F2]/90 hover:bg-[#1877F2] backdrop-blur-sm border border-white/20 text-white rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-[10px] sm:text-xs md:text-sm font-bold font-prompt">ติดต่อแฟนเพจ</span>
        </a>
      </section>

      {/* Embedded CarFilter moved below the image banner */}
      <div className="w-full max-w-5xl px-4 sm:px-6 mx-auto relative z-40 mt-6">
        <CarFilter />
      </div>



      {/* Popular Cars Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500">
              <TrendingUp className="w-4 h-4" /> Popular Rentals
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-prompt mt-1">
              {t.popularRentals}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">{t.popularSub}</p>
          </div>

          <button
            onClick={() => setCurrentView('cars')}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition"
          >
            <span>{t.viewAllCars} ({featuredCars.length} {t.unitsCount})</span>
            <ArrowRight className="w-4 h-4 text-blue-500" />
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCars.map((car) => (
            <CarCard key={car.car_id} car={car} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-800/80 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-prompt">
            {t.howItWorksTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">{t.howItWorksSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-center relative group hover:border-blue-500/50 transition">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/30 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h3 className="text-base font-bold text-white">{t.step1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-center relative group hover:border-blue-500/50 transition">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/30 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h3 className="text-base font-bold text-white">{t.step2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-center relative group hover:border-blue-500/50 transition">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/30 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h3 className="text-base font-bold text-white">{t.step3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step3Desc}
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
            {t.customerReviews}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">{t.reviewsSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {isEn 
                ? '"Very clean car, super punctual delivery! The Toyota Altis was so fuel-efficient. Admin responds super fast!"'
                : '"รถสะอาดมาก ส่งรถตรงเวลาเป๊ะ Toyota Altis ขับประหยัดน้ำมันมาก แอดมินตอบแชทไวและบริการเป็นกันเองสุดๆ ครับ"'}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-white">Phongsakorn J.</h4>
                <p className="text-[10px] text-slate-500">{isEn ? 'Rented Corolla Altis (3 Days)' : 'เช่า Corolla Altis (3 วัน)'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {isEn 
                ? '"Booked Civic e:HEV for trip to Chiang Mai. The website checkout was effortless and PromptPay slip was verified instantly!"'
                : '"จอง Civic e:HEV ไปเที่ยวเชียงใหม่กับเพื่อนๆ ประทับใจระบบจองหน้าเว็บง่ายมาก โอนผ่าน PromptPay สลิปผ่านอนุมัติไวมากค่ะ"'}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-white">Thanwa S.</h4>
                <p className="text-[10px] text-slate-500">{isEn ? 'Rented Honda Civic (2 Days)' : 'เช่า Honda Civic (2 วัน)'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {isEn 
                ? '"Rented Fortuner 7-seater for family roadtrip. Spacious, almost brand new, comprehensive insurance included!"'
                : '"เช่า Fortuner ไปเที่ยวต่างจังหวัดกับครอบครัว 7 ที่นั่งกว้างสบาย รถใหม่เพิ่งวิ่งไปหมื่นโล ประกันครบ สบายใจตลอดทริป"'}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-white">Anan K.</h4>
                <p className="text-[10px] text-slate-500">{isEn ? 'Rented Toyota Fortuner (5 Days)' : 'เช่า Toyota Fortuner (5 วัน)'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

