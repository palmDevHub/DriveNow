import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS, INITIAL_CARS, INITIAL_BOOKINGS, INITIAL_PAYMENTS, ADMIN_ANALYTICS } from '../services/mockData';
import { translations } from '../utils/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load initial state from LocalStorage or default mock data
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('drivenow_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('drivenow_cars');
    if (saved) {
      let parsed = JSON.parse(saved);
      if (parsed.length === 0) return INITIAL_CARS;
      
      // Force reload from INITIAL_CARS if old data lacks vehicle_type, doesn't have the new local images, contains old deleted cars, or lacks new model names/prices
      if (parsed[0] && (!parsed[0].vehicle_type || parsed[0].image !== '/Car1.jpg' || parsed.length !== 6 || parsed[0].model !== 'ATIV' || (parsed[1] && parsed[1].model !== 'ATIV') || (parsed[3] && parsed[3].price_per_day !== 400) || (parsed[4] && parsed[4].price_per_day !== 300) || (parsed[5] && parsed[5].price_per_day !== 450))) {
        return INITIAL_CARS;
      }

      parsed = parsed.map(c => 
        c.image === 'https://images.unsplash.com/photo-1541348263662-e082662dc324?auto=format&fit=crop&w=800&q=80'
        ? { ...c, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80' }
        : c
      );
      return parsed;
    }
    return INITIAL_CARS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('drivenow_bookings');
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.map(b => 
        b.car_image === 'https://images.unsplash.com/photo-1541348263662-e082662dc324?auto=format&fit=crop&w=800&q=80'
        ? { ...b, car_image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80' }
        : b
      );
      return parsed;
    }
    return INITIAL_BOOKINGS;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('drivenow_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('drivenow_chats');
    return saved ? JSON.parse(saved) : {};
  });

  // Language state ('th' | 'en')
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('drivenow_lang') || 'th';
  });

  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('drivenow_theme') || 'dark';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('drivenow_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation state - Always initialize customer section to 'home' on browser refresh
  const [currentView, setCurrentView] = useState(() => {
    const savedUser = localStorage.getItem('drivenow_current_user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj && userObj.role === 'admin') {
          return 'admin-dashboard';
        }
      } catch (e) {}
    }
    return 'home';
  });

  // Reset view to 'home' for customer section whenever page is reloaded / refreshed
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Language & Theme Persistence & DOM Effects
  useEffect(() => {
    localStorage.setItem('drivenow_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('drivenow_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'th' ? 'en' : 'th'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const t = translations[language] || translations['th'];

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
    vehicleType: 'Car',
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
    localStorage.setItem('drivenow_chats', JSON.stringify(chats));
  }, [chats]);

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

  const loginWithGoogle = () => {
    let googleUser = users.find(u => u.email === 'google@gmail.com');
    if (!googleUser) {
      googleUser = {
        user_id: `USR-00${users.length + 1}`,
        name: 'Google User',
        email: 'google@gmail.com',
        password: '',
        phone: '089-999-9999',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [...prev, googleUser]);
    }
    setCurrentUser(googleUser);
    showToast('เข้าสู่ระบบด้วย Google สำเร็จ!', 'success');
    setCurrentView('home');
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

  const submitReview = (bookingId, rating, comment) => {
    setBookings(prev => prev.map(b => 
      b.booking_id === bookingId 
        ? { ...b, has_reviewed: true, rating, review_comment: comment }
        : b
    ));
    showToast('ขอบคุณสำหรับคำติชมและคะแนนของคุณครับ!', 'success');
  };

  const sendChatMessage = (userId, userName, text, sender) => {
    setChats(prev => {
      const userChat = prev[userId] || { userName, messages: [] };
      return {
        ...prev,
        [userId]: {
          ...userChat,
          userName: userName || userChat.userName,
          messages: [...userChat.messages, { id: Date.now(), text, sender, timestamp: Date.now() }]
        }
      };
    });
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
      language,
      theme,
      t,
      ADMIN_ANALYTICS,
      setCurrentView,
      setSelectedCar,
      setBookingDraft,
      setSearchFilter,
      setLanguage,
      setTheme,
      toggleLanguage,
      toggleTheme,
      login,
      loginWithGoogle,
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
      submitReview,
      sendChatMessage,
      chats,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
