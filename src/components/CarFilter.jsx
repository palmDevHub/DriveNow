import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, SlidersHorizontal, Calendar, X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const CarFilter = () => {
  const { searchFilter, setSearchFilter, t, language } = useApp();

  const categories = [language === 'en' ? 'All' : 'ทั้งหมด', 'Sedan', 'SUV', 'EV', 'Truck', 'MPV'];

  const handleCategoryClick = (cat) => {
    setSearchFilter(prev => ({ ...prev, category: cat }));
  };

  const handleReset = () => {
    setSearchFilter({
      keyword: '',
      category: language === 'en' ? 'All' : 'ทั้งหมด',
      minPrice: 0,
      maxPrice: 5000,
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="bg-slate-950/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Top Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input Keyword */}
        <div className="md:col-span-11 relative group">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors z-10" />
          <input
            type="text"
            value={searchFilter.keyword}
            onChange={(e) => setSearchFilter(prev => ({ ...prev, keyword: e.target.value }))}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-10 py-3.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.25)] rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none transition-all duration-300 relative z-0"
          />
          {searchFilter.keyword && (
            <button
              onClick={() => setSearchFilter(prev => ({ ...prev, keyword: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white z-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-1 flex items-center">
          <button
            onClick={handleReset}
            title={language === 'en' ? 'Reset Filters' : 'ล้างตัวกรอง'}
            className="w-full h-full min-h-[56px] flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 shrink-0 mr-2">
          <Filter className="w-4 h-4 text-blue-400" /> {language === 'en' ? 'Type:' : 'ประเภท:'}
        </span>
        {categories.map((cat) => {
          const isSelected = searchFilter.category === cat || (searchFilter.category === 'ทั้งหมด' && cat === 'All');
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium shrink-0 transition-all duration-300 ${
                isSelected
                  ? 'text-white font-bold keep-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
