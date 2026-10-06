import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Users } from 'lucide-react';
import { CarCard } from './CarCard';

export const LuggageCalculator = () => {
  const { cars, language } = useApp();
  const isEn = language === 'en';
  
  const [passengers, setPassengers] = useState(2);
  const [bigLuggage, setBigLuggage] = useState(1);
  const [smallLuggage, setSmallLuggage] = useState(1);

  const recommendedCars = cars.filter(car => {
    let seatCap = car.seats;
    let trunkBig = car.type === 'SUV' ? 3 : (car.seats >= 7 ? 2 : 1);
    let trunkSmall = car.type === 'SUV' ? 4 : (car.seats >= 7 ? 2 : 2);
    
    if (passengers > seatCap) return false;
    
    let extraSeats = seatCap - passengers;
    let totalBigCapacity = trunkBig + extraSeats;
    let totalSmallCapacity = trunkSmall + (extraSeats * 2);
    
    if (bigLuggage > totalBigCapacity) return false;
    
    let remainingBig = totalBigCapacity - bigLuggage;
    let currentSmallCap = trunkSmall + (remainingBig * 2);
    
    if (smallLuggage > currentSmallCap) return false;
    
    return true;
  }).slice(0, 2);

  return (
    <section className="bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        
        <div className="w-full md:w-1/3 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">
              <Briefcase className="w-4 h-4" /> Luggage Fitting Calculator
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-prompt">
              {isEn ? 'Will it fit?' : 'สัมภาระจะพอดีรถไหม?'}
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {isEn ? 'Tell us what you are bringing, and we will recommend the perfect car size with enough trunk space.' : 'ระบุจำนวนผู้โดยสารและสัมภาระ เพื่อให้เราเลือกรถที่มีพื้นที่เก็บของเพียงพอสำหรับคุณ'}
            </p>
          </div>

          <div className="space-y-5 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-semibold flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {isEn ? 'Passengers' : 'ผู้โดยสาร'}</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">{passengers} {isEn ? 'Persons' : 'คน'}</span>
              </label>
              <input type="range" min="1" max="7" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-semibold flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {isEn ? 'Large Suitcase (28")' : 'กระเป๋าใบใหญ่ (28 นิ้ว)'}</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">{bigLuggage} {isEn ? 'Bags' : 'ใบ'}</span>
              </label>
              <input type="range" min="0" max="6" value={bigLuggage} onChange={(e) => setBigLuggage(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-semibold flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400 scale-75" /> {isEn ? 'Cabin Luggage (20")' : 'กระเป๋าใบเล็ก (20 นิ้ว)'}</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">{smallLuggage} {isEn ? 'Bags' : 'ใบ'}</span>
              </label>
              <input type="range" min="0" max="8" value={smallLuggage} onChange={(e) => setSmallLuggage(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">{isEn ? 'Recommended Cars for you' : 'รถที่เหมาะกับสัมภาระของคุณ'}</h3>
          </div>
          {recommendedCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedCars.map(car => (
                <CarCard key={car.car_id} car={car} />
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/50">
              <Briefcase className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm font-bold text-white">{isEn ? 'No single car fits this much!' : 'สัมภาระเยอะเกินกว่า 1 คันจะรับไหว!'}</p>
              <p className="text-xs text-slate-400 mt-1">{isEn ? 'Consider renting a minivan or multiple cars.' : 'แนะนำให้เช่ารถ 2 คัน หรือรถตู้โดยเฉพาะครับ'}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
