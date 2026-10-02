import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTHB, getCarStatusBadge } from '../../utils/formatters';
import { Car, Plus, Edit, Trash2, Search, X, Check, SlidersHorizontal, AlertCircle } from 'lucide-react';

export const AdminCarsPage = () => {
  const { cars, addCar, updateCar, deleteCar, toggleCarStatus } = useApp();

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [formState, setFormState] = useState({
    brand: 'Toyota',
    model: '',
    type: 'Sedan',
    price_per_day: 1500,
    status: 'ว่าง',
    seats: 5,
    transmission: 'ออโต้ (CVT)',
    fuel: 'เบนซิน',
    year: 2024,
    plate_number: '',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: ''
  });

  const filteredCars = cars.filter(c => {
    if (statusFilter !== 'ทั้งหมด' && c.status !== statusFilter) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      return (
        c.brand.toLowerCase().includes(kw) ||
        c.model.toLowerCase().includes(kw) ||
        (c.plate_number && c.plate_number.toLowerCase().includes(kw))
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingCar(null);
    setFormState({
      brand: 'Toyota',
      model: '',
      type: 'Sedan',
      price_per_day: 1500,
      status: 'ว่าง',
      seats: 5,
      transmission: 'ออโต้',
      fuel: 'เบนซิน',
      year: 2024,
      plate_number: '1กข 9988 กรุงเทพฯ',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      description: 'รถสภาพดีเยี่ยม ตรวจเช็คระยะเรียบร้อย พร้อมใช้งานทันที'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (car) => {
    setEditingCar(car);
    setFormState({ ...car });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (editingCar) {
      updateCar(editingCar.car_id, formState);
    } else {
      addCar(formState);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar - Matching Wireframe 12 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider">
            <Car className="w-4 h-4" /> Vehicle Inventory
          </div>
          <h1 className="text-3xl font-extrabold text-white font-prompt mt-1">
            จัดการข้อมูลรถเช่า (Manage Cars - CRUD)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            เพิ่ม แก้ไข ลบข้อมูลรถ และปรับเปลี่ยนสถานะรถว่าง/ถูกจอง/ซ่อม
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/50"
        >
          <Plus className="w-4 h-4" /> เพิ่มข้อมูลรถคันใหม่
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ค้นหาตามยี่ห้อ รุ่น หรือ ทะเบียน..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs text-slate-400 shrink-0">สถานะ:</span>
          {['ทั้งหมด', 'ว่าง', 'ถูกจอง', 'กำลังเช่า', 'ซ่อม'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition ${
                statusFilter === st
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Cars Management Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">รูปภาพ</th>
                <th className="p-4">รหัสรถ</th>
                <th className="p-4">ยี่ห้อ/รุ่น</th>
                <th className="p-4">ประเภท/เกียร์</th>
                <th className="p-4">ราคา/วัน</th>
                <th className="p-4">สถานะการใช้งาน</th>
                <th className="p-4 text-right">จัดการข้อมูล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCars.map((car) => {
                const badge = getCarStatusBadge(car.status);
                return (
                  <tr key={car.car_id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <img
                        src={car.image}
                        alt={car.model}
                        className="w-16 h-12 object-cover rounded-xl border border-slate-800"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold text-red-400">{car.car_id}</td>
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{car.brand} {car.model}</div>
                      <div className="text-[10px] text-slate-400">ทะเบียน: {car.plate_number || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium">{car.type}</div>
                      <div className="text-[10px] text-slate-400">{car.transmission} • {car.fuel}</div>
                    </td>
                    <td className="p-4 font-extrabold text-red-500 font-prompt text-sm">
                      {formatTHB(car.price_per_day)}
                    </td>
                    <td className="p-4">
                      <select
                        value={car.status}
                        onChange={(e) => toggleCarStatus(car.car_id, e.target.value)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border bg-slate-950 focus:outline-none cursor-pointer ${badge.color} ${badge.border}`}
                      >
                        <option value="ว่าง">ว่าง (Available)</option>
                        <option value="ถูกจอง">ถูกจอง (Reserved)</option>
                        <option value="กำลังเช่า">กำลังเช่า (Rented)</option>
                        <option value="ซ่อม">ซ่อม (Maintenance)</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(car)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`คุณต้องการลบข้อมูลรถ ${car.brand} ${car.model} ใช่หรือไม่?`)) {
                              deleteCar(car.car_id);
                            }
                          }}
                          className="p-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-400 rounded-xl"
                          title="ลบรถคันนี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Car Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8 animate-slide-down">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-prompt flex items-center gap-2">
                <Car className="w-5 h-5 text-red-500" />
                {editingCar ? `แก้ไขข้อมูลรถ (${editingCar.car_id})` : 'เพิ่มข้อมูลรถคันใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">ยี่ห้อรถ (Brand)</label>
                  <input
                    type="text"
                    required
                    value={formState.brand}
                    onChange={(e) => setFormState({ ...formState, brand: e.target.value })}
                    placeholder="เช่น Toyota, Honda, MG"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">รุ่นรถ (Model)</label>
                  <input
                    type="text"
                    required
                    value={formState.model}
                    onChange={(e) => setFormState({ ...formState, model: e.target.value })}
                    placeholder="เช่น Camry 2.5 HV, Civic RS"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">ประเภทรถ (Type)</label>
                  <select
                    value={formState.type}
                    onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="EV">EV (รถไฟฟ้า)</option>
                    <option value="Truck">Truck (กระบะ)</option>
                    <option value="MPV">MPV</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">ราคาเช่าต่อวัน (บาท)</label>
                  <input
                    type="number"
                    required
                    value={formState.price_per_day}
                    onChange={(e) => setFormState({ ...formState, price_per_day: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">สถานะตั้งต้น</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="ว่าง">ว่าง</option>
                    <option value="ถูกจอง">ถูกจอง</option>
                    <option value="กำลังเช่า">กำลังเช่า</option>
                    <option value="ซ่อม">ซ่อม</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">จำนวนที่นั่ง</label>
                  <input
                    type="number"
                    value={formState.seats}
                    onChange={(e) => setFormState({ ...formState, seats: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">ระบบเกียร์</label>
                  <input
                    type="text"
                    value={formState.transmission}
                    onChange={(e) => setFormState({ ...formState, transmission: e.target.value })}
                    placeholder="ออโต้ / ธรรมดา"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">ประเภทเชื้อเพลิง</label>
                  <input
                    type="text"
                    value={formState.fuel}
                    onChange={(e) => setFormState({ ...formState, fuel: e.target.value })}
                    placeholder="เบนซิน / ดีเซล / ไฮบริด / ไฟฟ้า 100%"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">รูปภาพ URL (Image URL)</label>
                <input
                  type="text"
                  required
                  value={formState.image}
                  onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">รายละเอียดเพิ่มเติม</label>
                <textarea
                  rows="3"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="คำอธิบายเกี่ยวกับรถ สมรรถนะ และความพร้อมใช้งาน"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/50"
                >
                  {editingCar ? 'บันทึกการแก้ไข' : 'เพิ่มรถใหม่'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
