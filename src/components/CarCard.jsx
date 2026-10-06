import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTHB, getCarStatusBadge } from '../utils/formatters';
import { Users, Fuel, Gauge, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CarCard = ({ car }) => {
  const { handleSelectCarForBooking, language, t, theme } = useApp();
  const statusInfo = getCarStatusBadge(car.status, language);
  const isAvailable = car.status === 'ว่าง' || car.status === 'available';

  return (
    <div className="group bg-slate-900/90 rounded-3xl border border-slate-800/80 overflow-hidden card-hover flex flex-col justify-between">
      
      {/* Top Image & Status Badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
            {statusInfo.text}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-950/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
            {car.type}
          </span>
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-mono text-slate-400 bg-slate-950/90 rounded-lg border border-slate-800">
          {car.year}
        </div>
      </div>

      {/* Car Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-semibold mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{car.brand}</span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition line-clamp-1">
            {car.model}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {car.description || 'รถคุณภาพดี ตรวจเช็คสภาพพร้อมใช้งาน ขับนุ่ม นั่งสบาย'}
          </p>
        </div>

        {/* Vehicle Specs Grid */}
        <div className={`grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-xs ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
          <div className={`flex items-center gap-1.5 p-2 rounded-xl border ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800/50'}`}>
            <Users className={`w-4 h-4 shrink-0 ${theme === 'light' ? 'text-blue-500' : 'text-slate-400'}`} />
            <span className="font-semibold">{car.seats} {t.seats}</span>
          </div>
          <div className={`flex items-center gap-1.5 p-2 rounded-xl border truncate ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800/50'}`}>
            <Gauge className={`w-4 h-4 shrink-0 ${theme === 'light' ? 'text-blue-500' : 'text-slate-400'}`} />
            <span className="truncate font-semibold">{car.transmission}</span>
          </div>
          <div className={`flex items-center gap-1.5 p-2 rounded-xl border truncate ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800/50'}`}>
            <Fuel className={`w-4 h-4 shrink-0 ${theme === 'light' ? 'text-blue-500' : 'text-slate-400'}`} />
            <span className="truncate font-semibold">{car.fuel}</span>
          </div>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-slate-400">{t.pricePerDay}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-blue-500 font-prompt">
                {formatTHB(car.price_per_day)}
              </span>
              <span className="text-xs text-slate-400">{t.perDay}</span>
            </div>
          </div>

          <button
            onClick={() => handleSelectCarForBooking(car)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              isAvailable
                ? 'bg-blue-600 hover:bg-blue-700 text-white keep-white shadow-blue-950/50 hover:gap-2'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>{isAvailable ? t.detailsAndBook : t.viewDetails}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

