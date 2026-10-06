import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Users, MapPin, Wallet, Car, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SmartRecommendation = () => {
  const { cars, setCurrentView, handleSelectCarForBooking, language } = useApp();
  const isEn = language === 'en';

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    people: '',
    purpose: '',
    budget: '',
    carType: ''
  });
  const [resultCar, setResultCar] = useState(null);
  const [matchScore, setMatchScore] = useState(0);
  const [reasons, setReasons] = useState([]);

  const handleNext = (field, value) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);
    if (step < 4) {
      setStep(step + 1);
    } else {
      calculateRecommendation(newAnswers);
    }
  };

  const calculateRecommendation = (finalAnswers) => {
    let bestCar = null;
    let bestScore = -1;
    let bestReasons = [];

    cars.forEach(car => {
      let score = 0;
      let currentReasons = [];

      // 1. People (Max 30)
      if (finalAnswers.people === '1-2' && car.seats <= 5) {
        score += 30;
        currentReasons.push(isEn ? 'Perfect for 1-2 people' : 'ขนาดพอดีสำหรับ 1-2 คน');
      } else if (finalAnswers.people === '3-5' && car.seats >= 4) {
        score += 30;
        currentReasons.push(isEn ? 'Spacious for 3-5 people' : 'นั่งสบายสำหรับ 3-5 คน');
      } else if (finalAnswers.people === '6-7' && car.seats >= 6) {
        score += 30;
        currentReasons.push(isEn ? 'Supports up to 7 people' : 'รองรับผู้โดยสารเยอะ');
      }

      // 2. Budget (Max 30)
      const price = car.price_per_day;
      if (finalAnswers.budget === '500-1000' && price <= 1000) {
        score += 30;
        currentReasons.push(isEn ? 'Within your economy budget' : 'อยู่ในงบประหยัดของคุณ');
      } else if (finalAnswers.budget === '1000-1500' && price > 1000 && price <= 1500) {
        score += 30;
        currentReasons.push(isEn ? 'Within your target budget' : 'อยู่ในงบประมาณที่คุณตั้งไว้');
      } else if (finalAnswers.budget === '1500-2500' && price > 1500 && price <= 2500) {
        score += 30;
        currentReasons.push(isEn ? 'Matches your premium budget' : 'เหมาะสมกับงบประมาณ');
      } else if (finalAnswers.budget === 'unlimited') {
        score += 30;
        currentReasons.push(isEn ? 'Best premium choice' : 'ตัวเลือกพรีเมียมที่ดีที่สุด');
      }

      // 3. Car Type (Max 20)
      if (finalAnswers.carType === 'Not sure' || finalAnswers.carType === 'ไม่แน่ใจ') {
        score += 20;
      } else if (car.type.toLowerCase() === finalAnswers.carType.toLowerCase()) {
        score += 20;
        currentReasons.push(isEn ? 'Matches your preferred car type' : 'ประเภทรถตรงตามที่คุณชอบ');
      }

      // 4. Purpose (Max 20)
      const type = car.type.toLowerCase();
      if (finalAnswers.purpose === 'city' && (type === 'sedan' || type === 'ev')) {
        score += 20;
        currentReasons.push(isEn ? 'Great for city driving' : 'คล่องตัวสูง เหมาะกับการขับขี่ในเมือง');
      } else if (finalAnswers.purpose === 'upcountry' && (type === 'suv' || type === 'truck')) {
        score += 20;
        currentReasons.push(isEn ? 'Excellent for long trips' : 'สมรรถนะดี เหมาะกับการเดินทางไกล');
      } else if (finalAnswers.purpose === 'business' && (type === 'sedan' || type === 'ev')) {
        score += 20;
        currentReasons.push(isEn ? 'Professional look for business' : 'ดีไซน์หรูหรา เหมาะกับติดต่อธุรกิจ');
      } else if (finalAnswers.purpose === 'family' && (type === 'suv' || type === 'mpv' || car.seats >= 7)) {
        score += 20;
        currentReasons.push(isEn ? 'Perfect for family trips' : 'พื้นที่กว้างขวาง เหมาะกับครอบครัว');
      } else if (finalAnswers.purpose === 'economy' && price < 1200) {
        score += 20;
        currentReasons.push(isEn ? 'Fuel efficient & economical' : 'ประหยัดน้ำมัน คุ้มค่าที่สุด');
      }

      // Update best car
      if (score > bestScore) {
        bestScore = score;
        bestCar = car;
        bestReasons = currentReasons.slice(0, 3);
      }
    });

    if (bestScore < 65) bestScore = 65 + Math.floor(Math.random() * 20);
    if (bestScore > 100) bestScore = 98; 

    setResultCar(bestCar);
    setMatchScore(bestScore);
    setReasons(bestReasons.length > 0 ? bestReasons : (isEn ? ['Highly recommended for you', 'Great value for money', 'Popular choice'] : ['รถแนะนำที่เหมาะกับคุณที่สุด', 'คุ้มค่ากับราคา', 'รถยอดนิยมของทางร้าน']));
    setStep(5);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setAnswers({ people: '', purpose: '', budget: '', carType: '' });
    }, 300);
  };

  return (
    <>
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md relative overflow-hidden my-8">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-white font-prompt flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            {isEn ? "Don't know which car to choose?" : "ไม่รู้จะเลือกรถคันไหนดี?"}
          </h3>
          <p className="text-sm text-slate-300">
            {isEn ? "Answer simple questions and let us help you choose the right car for you." : "ตอบคำถามง่าย ๆ ให้เราช่วยเลือกรถที่เหมาะกับคุณ"}
          </p>
        </div>
        
        <button
          onClick={() => setIsOpen(true)}
          className="relative z-10 px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-2xl shadow-[0_10px_25px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2 flex-shrink-0 hover:-translate-y-1"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          {isEn ? "Find My Perfect Car" : "ค้นหารถที่เหมาะกับฉัน"}
        </button>
      </div>

      {/* Wizard Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-[2rem] p-6 sm:p-8 w-full max-w-lg relative z-10 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {step < 5 && (
                <div className="flex gap-2 mb-8 mt-2">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-slate-800'}`} />
                  ))}
                </div>
              )}

              <div className="min-h-[300px] flex flex-col justify-center">
                {step === 1 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-white font-prompt">{isEn ? 'How many people?' : '1. เดินทางกี่คน?'}</h3>
                    </div>
                    <div className="space-y-3">
                      <button onClick={() => handleNext('people', '1-2')} className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 text-left rounded-2xl transition flex items-center gap-4 group">
                        <span className="text-2xl group-hover:scale-110 transition">👤</span>
                        <span className="font-semibold text-slate-200">1–2 {isEn ? 'People' : 'คน'}</span>
                      </button>
                      <button onClick={() => handleNext('people', '3-5')} className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 text-left rounded-2xl transition flex items-center gap-4 group">
                        <span className="text-2xl group-hover:scale-110 transition">👨‍👩‍👧</span>
                        <span className="font-semibold text-slate-200">3–5 {isEn ? 'People' : 'คน'}</span>
                      </button>
                      <button onClick={() => handleNext('people', '6-7')} className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 text-left rounded-2xl transition flex items-center gap-4 group">
                        <span className="text-2xl group-hover:scale-110 transition">👨‍👩‍👧‍👦</span>
                        <span className="font-semibold text-slate-200">6–7 {isEn ? 'People' : 'คน'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-white font-prompt">{isEn ? 'Purpose of trip?' : '2. ใช้รถเพื่ออะไร?'}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'city', icon: '🏙️', label: isEn ? 'City Drive' : 'เที่ยวในเมือง' },
                        { id: 'upcountry', icon: '🏖️', label: isEn ? 'Upcountry' : 'เที่ยวต่างจังหวัด' },
                        { id: 'business', icon: '💼', label: isEn ? 'Business' : 'ทำงาน / ธุรกิจ' },
                        { id: 'family', icon: '👨‍👩‍👧‍👦', label: isEn ? 'Family' : 'ครอบครัว' },
                        { id: 'economy', icon: '💰', label: isEn ? 'Economy' : 'เน้นประหยัด' },
                      ].map(item => (
                        <button key={item.id} onClick={() => handleNext('purpose', item.id)} className={`p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-center rounded-2xl transition group ${item.id === 'economy' ? 'col-span-2' : ''}`}>
                          <div className="text-2xl mb-2 group-hover:scale-110 transition">{item.icon}</div>
                          <div className="font-semibold text-slate-200 text-sm">{item.label}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-white font-prompt">{isEn ? 'Budget per day?' : '3. งบประมาณต่อวัน'}</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { id: '500-1000', label: '฿500–1,000' },
                        { id: '1000-1500', label: '฿1,000–1,500' },
                        { id: '1500-2500', label: '฿1,500–2,500' },
                        { id: 'unlimited', label: isEn ? 'Unlimited' : 'ไม่จำกัด' },
                      ].map(item => (
                        <button key={item.id} onClick={() => handleNext('budget', item.id)} className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-center rounded-2xl transition group">
                          <span className="font-semibold text-slate-200">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Car className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-white font-prompt">{isEn ? 'Preferred car type?' : '4. ชอบรถแบบไหน?'}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'Sedan', icon: '🚘', label: 'Sedan' },
                        { id: 'SUV', icon: '🚙', label: 'SUV' },
                        { id: 'EV', icon: '🚗', label: 'EV' },
                        { id: 'Truck', icon: '🛻', label: 'Truck' },
                        { id: 'Not sure', icon: '🤔', label: isEn ? 'Not sure' : 'ไม่แน่ใจ' },
                      ].map(item => (
                        <button key={item.id} onClick={() => handleNext('carType', item.id)} className={`p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500 text-center rounded-2xl transition group ${item.id === 'Not sure' ? 'col-span-2' : ''}`}>
                          <div className="text-2xl mb-2 group-hover:scale-110 transition">{item.icon}</div>
                          <div className="font-semibold text-slate-200 text-sm">{item.label}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 5 && resultCar && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 text-center pt-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold mx-auto">
                      <Sparkles className="w-4 h-4" /> {isEn ? 'Your Perfect Match' : '✨ รถที่เหมาะกับคุณ'}
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700 relative mt-2">
                      <div className="absolute -top-5 -right-5 w-16 h-16 bg-blue-600 rounded-full border-4 border-slate-900 flex items-center justify-center flex-col shadow-lg transform rotate-12 z-20">
                        <span className="text-xl font-black text-white leading-none">{matchScore}%</span>
                        <span className="text-[9px] text-blue-100 font-bold uppercase leading-none mt-1">Match</span>
                      </div>
                      
                      <h4 className="text-xl font-bold text-white mb-4 pr-6">🥇 {resultCar.brand} {resultCar.model}</h4>
                      
                      <img src={resultCar.image} alt={resultCar.model} className="w-full h-40 object-cover rounded-2xl mb-4 border border-slate-700" />
                      
                      <div className="text-left space-y-2 mb-4 bg-slate-900 p-4 rounded-2xl">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{isEn ? 'Why it matches you:' : 'เหมาะกับคุณเพราะ'}</p>
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-2xl font-extrabold text-blue-500 font-prompt mb-6">
                        ฿{resultCar.price_per_day.toLocaleString()} <span className="text-sm text-slate-400 font-normal">/ {isEn ? 'day' : 'วัน'}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            handleClose();
                            setCurrentView('car-detail');
                            handleSelectCarForBooking(resultCar);
                          }}
                          className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold transition"
                        >
                          {isEn ? 'Details' : 'ดูรายละเอียด'}
                        </button>
                        <button 
                          onClick={() => {
                            handleClose();
                            handleSelectCarForBooking(resultCar);
                            setCurrentView('checkout');
                          }}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/50 transition"
                        >
                          {isEn ? 'Book Now' : 'จองรถ'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

