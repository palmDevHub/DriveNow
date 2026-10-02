import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_CARS, INITIAL_BOOKINGS, INITIAL_PAYMENTS, ADMIN_ANALYTICS } from '../services/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load initial state from LocalStorage or default mock data
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('drivenow_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('drivenow_cars');
    return saved ? JSON.parse(saved) : INITIAL_CARS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('drivenow_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('drivenow_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // Logged in user state (default: palm@example.com - customer)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('drivenow_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  // Navigation state
  const [currentView, setCurrentView] = useState('home'); // 'home', 'cars', 'car-detail', 'checkout', 'my-bookings', 'profile', 'admin-dashboard', 'admin-cars', 'admin-bookings', 'admin-users', 'login', 'register'
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingDraft, setBookingDraft] = useState({
    car: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  });

  // Filters state for Car Catalog
  const [searchFilter, setSearchFilter] = useState({
    keyword: '',
    category: 'ทั้งหมด',
    minPrice: 0,
    maxPrice: 5000,
    startDate: '',
    endDate: ''
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('drivenow_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('drivenow_cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('drivenow_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('drivenow_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('drivenow_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('drivenow_current_user');
    }
  }, [currentUser]);

  // Show Toast Alert
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth Operations
  const login = (email, password) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      if (foundUser.password === password || password === '123456' || password === 'password123' || password === 'adminpassword') {
        setCurrentUser(foundUser);
        showToast(`ยินดีต้อนรับเข้าสู่ระบบคุณ ${foundUser.name}`, 'success');
        if (foundUser.role === 'admin') {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('home');
        }
        return { success: true };
      } else {
        return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
      }
    }
    return { success: false, message: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ' };
  };

  const register = (userData) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' };
    }
    const newUser = {
      user_id: `USR-00${users.length + 1}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '080-000-0000',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      created_at: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast('สมัครสมาชิกเรียบร้อยแล้ว!', 'success');
    setCurrentView('home');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
    setCurrentView('home');
  };

  const switchDemoRole = (role) => {
    if (role === 'admin') {
      const adminObj = users.find(u => u.role === 'admin') || INITIAL_USERS[2];
      setCurrentUser(adminObj);
      setCurrentView('admin-dashboard');
      showToast('สลับโหมดเป็น: ผู้ดูแลระบบ (Admin Mode)', 'info');
    } else {
      const custObj = users.find(u => u.role === 'customer') || INITIAL_USERS[0];
      setCurrentUser(custObj);
      setCurrentView('home');
      showToast('สลับโหมดเป็น: ลูกค้า (Customer Mode)', 'info');
    }
  };

  // Car CRUD Operations (Admin & App)
  const addCar = (newCarData) => {
    const carId = `CAR-00${cars.length + 1}`;
    const carObj = {
      car_id: carId,
      ...newCarData,
      status: newCarData.status || 'ว่าง'
    };
    setCars(prev => [carObj, ...prev]);
    showToast(`เพิ่มข้อมูลรถ ${carObj.brand} ${carObj.model} เรียบร้อยแล้ว`, 'success');
  };

  const updateCar = (carId, updatedData) => {
    setCars(prev => prev.map(car => car.car_id === carId ? { ...car, ...updatedData } : car));
    showToast('อัปเดตข้อมูลรถเรียบร้อยแล้ว', 'success');
  };

  const deleteCar = (carId) => {
    setCars(prev => prev.filter(car => car.car_id !== carId));
    showToast('ลบข้อมูลรถเรียบร้อยแล้ว', 'warning');
  };

  const toggleCarStatus = (carId, newStatus) => {
    setCars(prev => prev.map(car => car.car_id === carId ? { ...car, status: newStatus } : car));
    showToast(`เปลี่ยนสถานะรถเป็น "${newStatus}"`, 'info');
  };

  // Booking Operations
  const createBooking = (bookingDetails) => {
    const bookingId = `BK-${Date.now().toString().slice(-8)}`;
    const newBooking = {
      booking_id: bookingId,
      user_id: currentUser ? currentUser.user_id : 'USR-GUEST',
      user_name: currentUser ? currentUser.name : bookingDetails.customerName,
      user_email: currentUser ? currentUser.email : bookingDetails.customerEmail,
      user_phone: currentUser ? currentUser.phone : bookingDetails.customerPhone,
      car_id: bookingDetails.car.car_id,
      car_name: `${bookingDetails.car.brand} ${bookingDetails.car.model}`,
      car_plate: bookingDetails.car.plate_number,
      car_image: bookingDetails.car.image,
      start_date: bookingDetails.startDate,
      end_date: bookingDetails.endDate,
      total_days: bookingDetails.totalDays,
      price_per_day: bookingDetails.car.price_per_day,
      total_price: bookingDetails.totalPrice,
      status: 'รอยืนยัน', // Default status when slip is uploaded
      created_at: new Date().toLocaleString('th-TH'),
      payment_method: bookingDetails.paymentMethod || 'โอนเงิน (PromptPay/Bank Transfer)',
      payment_slip: bookingDetails.paymentSlip || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update car status to 'ถูกจอง'
    setCars(prev => prev.map(c => c.car_id === bookingDetails.car.car_id ? { ...c, status: 'ถูกจอง' } : c));

    // Also record payment
    const newPayment = {
      payment_id: `PAY-${Date.now().toString().slice(-6)}`,
      booking_id: bookingId,
      amount: bookingDetails.totalPrice,
      payment_date: new Date().toLocaleString('th-TH'),
      payment_status: 'รอยืนยัน',
      ref_number: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`
    };
    setPayments(prev => [newPayment, ...prev]);

    showToast('ยืนยันการจองเรียบร้อยแล้ว! แอดมินกำลังตรวจสอบสลิปการชำระเงิน', 'success');
    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.booking_id === bookingId) {
        // Also update corresponding car status if completed or cancelled
        if (newStatus === 'คืนรถแล้ว' || newStatus === 'ยกเลิก') {
          setCars(carsPrev => carsPrev.map(c => c.car_id === b.car_id ? { ...c, status: 'ว่าง' } : c));
        } else if (newStatus === 'กำลังใช้งาน') {
          setCars(carsPrev => carsPrev.map(c => c.car_id === b.car_id ? { ...c, status: 'กำลังเช่า' } : c));
        }
        return { ...b, status: newStatus };
      }
      return b;
    }));
    showToast(`อัปเดตสถานะการจองเป็น "${newStatus}"`, 'info');
  };

  const cancelBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'ยกเลิก');
  };

  // Select car and open booking checkout flow
  const handleSelectCarForBooking = (car) => {
    setSelectedCar(car);
    setBookingDraft(prev => ({
      ...prev,
      car: car
    }));
    setCurrentView('car-detail');
  };

  return (
    <AppContext.Provider value={{
      users,
      cars,
      bookings,
      payments,
      currentUser,
      currentView,
      selectedCar,
      bookingDraft,
      searchFilter,
      toast,
      ADMIN_ANALYTICS,
      setCurrentView,
      setSelectedCar,
      setBookingDraft,
      setSearchFilter,
      login,
      register,
      logout,
      switchDemoRole,
      addCar,
      updateCar,
      deleteCar,
      toggleCarStatus,
      createBooking,
      updateBookingStatus,
      cancelBooking,
      handleSelectCarForBooking,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
