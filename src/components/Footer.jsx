import React from 'react';
import { Car, Phone, Mail, MapPin, ShieldCheck, Clock, Award, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setCurrentView, t, language } = useApp();
  const isEn = language === 'en';

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {isEn ? 'New & Clean' : 'รถใหม่ สะอาด'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? 'Sanitized before delivery' : 'ทำความสะอาดก่อนส่งมอบ'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {isEn ? 'Safe & Secure' : 'ปลอดภัย มั่นใจทุกเส้นทาง'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? 'Comprehensive insurance' : 'พร้อมประกันภัยครอบคลุม'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {isEn ? 'Explore Everywhere' : 'เที่ยวได้ครบ ทุกแลนด์มาร์ค'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? 'Go anywhere you desire' : 'ไปได้ทุกที่ที่คุณต้องการ'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {isEn ? 'Best Value' : 'คุ้มค่า ราคาเป็นกันเอง'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? 'No hidden fees' : 'ราคาสุทธิ ไม่มีบวกเพิ่ม'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/herologo.jpg" alt="Car Rental Songkhla" className="w-10 h-10 rounded-xl object-cover" />
              <span className="text-xl font-bold text-white tracking-tight">
                Car Rental Songkhla
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isEn 
                ? 'Full-service car rental agency offering daily, monthly, and chauffeur-driven rides for all your travel needs.' 
                : 'บริการเช่ารถยนต์ครบวงจร ทั้งรายวัน รายเดือน พร้อมคนขับและเช่าขับเอง มีรถหลากหลายประเภทตอบโจทย์ทุกไลฟ์สไตล์การเดินทาง'}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isEn ? 'Quick Links' : 'ลิงก์ด่วน'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-blue-400 transition">{t.home}</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('cars')} className="hover:text-blue-400 transition">{t.cars}</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('my-bookings')} className="hover:text-blue-400 transition">{t.myBookings}</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin-dashboard')} className="hover:text-blue-400 transition text-blue-400">
                  {isEn ? 'Backend Admin System' : 'ระบบแอดมิน (Backend Admin)'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isEn ? 'Vehicle Categories' : 'ประเภทรถยนต์'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-white cursor-pointer">Sedan</li>
              <li className="hover:text-white cursor-pointer">SUV / Crossover</li>
              <li className="hover:text-white cursor-pointer">EV (Electric Vehicles)</li>
              <li className="hover:text-white cursor-pointer">Truck</li>
              <li className="hover:text-white cursor-pointer">MPV / Van</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isEn ? 'Contact Us' : 'ติดต่อเรา'}
            </h5>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>02-777-8899 / 081-234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@carrentalsongkhla.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{isEn ? '123/45 Sukhumvit Rd, Khlong Toei, Bangkok 10110' : '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Car Rental Songkhla. {isEn ? 'Online Car Rental Portal.' : 'ระบบจองรถเช่าออนไลน์'}</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>{isEn ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว'}</span>
            <span>{isEn ? 'Terms & Conditions' : 'ข้อกำหนดและเงื่อนไข'}</span>
            <span>{isEn ? 'Help & FAQ' : 'ความช่วยเหลือ'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

