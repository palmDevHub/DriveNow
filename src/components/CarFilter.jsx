import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, SlidersHorizontal, Calendar, X, Filter } from 'lucide-react';

export const CarFilter = () => {
  const { searchFilter, setSearchFilter } = useApp();

  const categories = ['ทั้งหมด', 'Sedan', 'SUV', 'EV', 'Truck', 'MPV'];

  const handleCategoryClick = (cat) => {
    setSearchFilter(prev => ({ ...prev, category: cat }));
  };

  const handleReset = () => {
    setSearchFilter({
      keyword: '',
      category: 'ทั้งหมด',
      minPrice: 0,
      maxPrice: 5000,
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800/80 shadow-2xl space-y-5">
      
      {/* Top Search Bar & Date Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input Keyword */}
        <div className="md:col-span-5 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter.keyword}
            onChange={(e) => setSearchFilter(prev => ({ ...prev, keyword: e.target.value }))}
            placeholder="ค้นหาตามยี่ห้อ หรือรุ่นรถ เช่น Toyota, Civic, Fortuner..."
            className="w-full pl-12 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-red-500 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none transition"
          />
          {searchFilter.keyword && (
            <button
              onClick={() => setSearchFilter(prev => ({ ...prev, keyword: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Start Date */}
        <div className="md:col-span-3 relative">
          <div className="absolute left-3 top-1.5 text-[10px] text-slate-400 font-semibold uppercase">วันเริ่มเช่า</div>
          <input
            type="date"
            value={searchFilter.startDate}
            onChange={(e) => setSearchFilter(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3 pt-5 pb-1.5 bg-slate-950/80 border border-slate-800 focus:border-red-500 rounded-2xl text-xs text-white focus:outline-none"
          />
        </div>

        {/* End Date */}
        <div className="md:col-span-3 relative">
          <div className="absolute left-3 top-1.5 text-[10px] text-slate-400 font-semibold uppercase">วันคืนรถ</div>
          <input
            type="date"
            value={searchFilter.endDate}
            onChange={(e) => setSearchFilter(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3 pt-5 pb-1.5 bg-slate-950/80 border border-slate-800 focus:border-red-500 rounded-2xl text-xs text-white focus:outline-none"
          />
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-1 flex items-center">
          <button
            onClick={handleReset}
            title="ล้างตัวกรอง"
            className="w-full h-full min-h-[48px] flex items-center justify-center p-3 bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-red-400 rounded-2xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" /> ประเภท:
        </span>
        {categories.map((cat) => {
          const isSelected = searchFilter.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium shrink-0 transition-all ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/50 font-bold'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

    </div>
  );
};
