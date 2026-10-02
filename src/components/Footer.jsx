import React from 'react';
import { Car, Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">ประกันภัยชั้น 1 ทุกคัน</h4>
              <p className="text-xs text-slate-400 mt-0.5">คุ้มครองตลอดการเดินทาง ไม่มีค่าใช้จ่ายแอบแฝง</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">ส่งรถถึงหน้าบ้าน 24 ชั่วโมง</h4>
              <p className="text-xs text-slate-400 mt-0.5">บริการรับ-ส่งรถฟรีในเขตกรุงเทพและปริมณฑล</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">รถใหม่สะอาด ตรวจเช็คก่อนส่ง</h4>
              <p className="text-xs text-slate-400 mt-0.5">ผ่านการล้างพ่นฆ่าเชื้อและตรวจสภาพความพร้อม 100%</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Drive<span className="text-red-500">Now</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              บริการเช่ารถยนต์ครบวงจร ทั้งรายวัน รายเดือน พร้อมคนขับและเช่าขับเอง มีรถหลากหลายประเภทตอบโจทย์ทุกไลฟ์สไตล์การเดินทาง
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">ลิงก์ด่วน</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-red-400 transition">หน้าแรก (Landing Page)</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('cars')} className="hover:text-red-400 transition">ค้นหารถเช่า</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('my-bookings')} className="hover:text-red-400 transition">ตรวจสอบสถานะการจอง</button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin-dashboard')} className="hover:text-red-400 transition text-red-400">ระบบแอดมิน (Backend Admin)</button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">ประเภทรถยนต์</h5>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-white cursor-pointer">Sedan (รถเก๋ง 4 ประตู)</li>
              <li className="hover:text-white cursor-pointer">SUV / Crossover (รถอเนกประสงค์)</li>
              <li className="hover:text-white cursor-pointer">EV (รถยนต์ไฟฟ้า 100%)</li>
              <li className="hover:text-white cursor-pointer">Truck (รถกระบะ 4 ประตู)</li>
              <li className="hover:text-white cursor-pointer">MPV (รถตู้และ 7 ที่นั่ง)</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">ติดต่อเรา</h5>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>02-777-8899 / 081-234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>support@drivenow.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DriveNow Co., Ltd. ระบบจองรถเช่าออนไลน์ - Computer Science Final Project.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>ข้อกำหนดและเงื่อนไข</span>
            <span>ความช่วยเหลือ</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
