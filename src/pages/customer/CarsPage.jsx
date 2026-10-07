import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CarCard } from '../../components/CarCard';
import { CarFilter } from '../../components/CarFilter';
import { Car, SlidersHorizontal, ArrowUpDown, Info } from 'lucide-react';

export const CarsPage = () => {
  const { cars, searchFilter, t, language } = useApp();
  const isEn = language === 'en';
  const [sortBy, setSortBy] = useState('default');

  // Filter cars based on searchFilter
  const filteredCars = cars.filter(car => {
    // Vehicle Type match (Car vs Mt)
    if (searchFilter.vehicleType && car.vehicle_type !== searchFilter.vehicleType) {
      return false;
    }

    // Category match
    if (searchFilter.category !== 'ทั้งหมด' && searchFilter.category !== 'All' && car.type.toLowerCase() !== searchFilter.category.toLowerCase()) {
      return false;
    }

    // Keyword match
    if (searchFilter.keyword) {
      const kw = searchFilter.keyword.toLowerCase();
      const matchBrand = car.brand.toLowerCase().includes(kw);
      const matchModel = car.model.toLowerCase().includes(kw);
      const matchPlate = car.plate_number ? car.plate_number.toLowerCase().includes(kw) : false;
      const matchType = car.type.toLowerCase().includes(kw);
      if (!matchBrand && !matchModel && !matchPlate && !matchType) return false;
    }

    return true;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price_per_day - b.price_per_day;
    if (sortBy === 'price-desc') return b.price_per_day - a.price_per_day;
    return 0;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
            <Car className="w-4 h-4" /> Car Rental Songkhla Fleet
          </div>
          <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
            {t.cars} ({sortedCars.length} {t.unitsCount})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isEn ? 'Select your ideal car and book your journey instantly.' : 'เลือกรถที่คุณต้องการและเริ่มจองเดินทางได้ทันที'}
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> {isEn ? 'Sort by:' : 'เรียงตาม:'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="default">{isEn ? 'Featured' : 'รายการแนะนำ'}</option>
            <option value="price-asc">{isEn ? 'Price: Low ➔ High' : 'ราคาเช่า: ต่ำสุด ➔ สูงสุด'}</option>
            <option value="price-desc">{isEn ? 'Price: High ➔ Low' : 'ราคาเช่า: สูงสุด ➔ ต่ำสุด'}</option>
          </select>
        </div>
      </div>

      {/* Filter Component */}
      <CarFilter />

      {/* Cars Grid */}
      {sortedCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCars.map((car) => (
            <CarCard key={car.car_id} car={car} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
            <Info className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">{isEn ? 'No cars match your criteria' : 'ไม่พบบรรดารถที่ตรงตามเงื่อนไข'}</h3>
          <p className="text-xs text-slate-400">
            {isEn ? 'Try adjusting your vehicle category or search keywords.' : 'ลองปรับเปลี่ยนประเภทรถ หรือคำค้นหาในช่องค้นหาอีกครั้ง'}
          </p>
        </div>
      )}

    </div>
  );
};

