export const INITIAL_USERS = [
  {
    user_id: 'USR-001',
    name: 'นายพงศกร ใจดี',
    email: 'palm@example.com',
    password: 'password123',
    phone: '081-234-5678',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    id_card: '1-1002-99881-22-3',
    driver_license: 'DL-99182347',
    created_at: '2025-01-10'
  },
  {
    user_id: 'USR-002',
    name: 'นางสาวธันวา สุขเจริญ',
    email: 'thanwa@example.com',
    password: 'password123',
    phone: '089-456-7890',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    id_card: '3-9812-44123-11-9',
    driver_license: 'DL-44819231',
    created_at: '2025-02-14'
  },
  {
    user_id: 'USR-003',
    name: 'ผู้ดูแลระบบ (Admin DriveNow)',
    email: 'admin@drivenow.com',
    password: 'adminpassword',
    phone: '02-777-8899',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    created_at: '2025-01-01'
  },
  {
    vehicle_type: 'Mt',
    car_id: 'MT-003',
    brand: 'Vespa',
    model: 'Sprint 150 i-Get ABS',
    type: 'Scooter',
    price_per_day: 900,
    status: 'ว่าง',
    seats: 2,
    transmission: 'ออโต้',
    fuel: 'เบนซิน',
    year: 2023,
    image: '/Mt3.jpg',
    description: 'สกู๊ตเตอร์คลาสสิกดีไซน์พรีเมียม ขับขี่โดดเด่นไม่ซ้ำใคร'
  }
];

export const INITIAL_CARS = [
  {
    car_id: 'CAR-001',
    vehicle_type: 'Car',
    brand: 'Toyota',
    model: 'ATIV',
    type: 'Sedan',
    price_per_day: 1299,
    status: 'ว่าง',
    seats: 5,
    transmission: 'ออโต้ (CVT)',
    fuel: 'เบนซิน-ไฮบริด',
    year: 2024,
    image: '/Car1.jpg',
    description: 'รถซีดานขนาดกลางประหยัดน้ำมัน ขับนุ่มเงียบ เหมาะสำหรับการเดินทางในเมืองและท่องเที่ยวต่างจังหวัด'
  },
  {
    car_id: 'CAR-002',
    vehicle_type: 'Car',
    brand: 'Toyota',
    model: 'ATIV',
    type: 'Sedan',
    price_per_day: 1499,
    status: 'ว่าง',
    seats: 5,
    transmission: 'ออโต้ (e-CVT)',
    fuel: 'ไฮบริด',
    year: 2024,
    image: '/Car2.jpg',
    description: 'ดีไซน์สปอร์ตหรูหรา ขุมพลังไฮบริดตอบสนองทันใจ สมรรถนะเยี่ยม พร้อมระบบความปลอดภัย Honda SENSING'
  },
  {
    car_id: 'CAR-003',
    vehicle_type: 'Car',
    brand: 'Toyota',
    model: 'ATIV',
    type: 'Sedan',
    price_per_day: 1299,
    status: 'ว่าง',
    seats: 5,
    transmission: 'ออโต้ (CVT)',
    fuel: 'เบนซิน',
    year: 2024,
    image: '/Car3.jpg',
    description: 'รถยนต์ซีดานดีไซน์สปอร์ต ขับขี่สบาย ประหยัดน้ำมัน'
  },
  {
    vehicle_type: 'Mt',
    car_id: 'MT-001',
    brand: 'Yamaha',
    model: 'Fazzio',
    type: 'Scooter',
    price_per_day: 400,
    status: 'ว่าง',
    seats: 2,
    transmission: 'ออโต้',
    fuel: 'เบนซิน',
    year: 2023,
    image: '/Mt1.jpg',
    description: 'มอเตอร์ไซค์ออโตเมติกยอดนิยม ขับขี่สบาย ประหยัดน้ำมัน'
  },
  {
    vehicle_type: 'Mt',
    car_id: 'MT-002',
    brand: 'Honda',
    model: 'Wave 110i',
    type: 'Scooter',
    price_per_day: 300,
    status: 'ว่าง',
    seats: 2,
    transmission: 'ออโต้',
    fuel: 'เบนซิน',
    year: 2023,
    image: '/Mt2.jpg',
    description: 'บิ๊กสกู๊ตเตอร์ดีไซน์สปอร์ต เครื่องยนต์แรง'
  },
  {
    vehicle_type: 'Mt',
    car_id: 'MT-003',
    brand: 'Honda',
    model: 'Giorno',
    type: 'Scooter',
    price_per_day: 450,
    status: 'ว่าง',
    seats: 2,
    transmission: 'ออโต้',
    fuel: 'เบนซิน',
    year: 2023,
    image: '/Mt3.jpg',
    description: 'สกู๊ตเตอร์คลาสสิกดีไซน์พรีเมียม ขับขี่โดดเด่นไม่ซ้ำใคร'
  }
];

export const INITIAL_BOOKINGS = [
  {
    booking_id: 'BK-20250801',
    user_id: 'USR-001',
    user_name: 'นายพงศกร ใจดี',
    user_email: 'palm@example.com',
    user_phone: '081-234-5678',
    car_id: 'CAR-001',
    car_name: 'Toyota Corolla Altis 1.8 HEV',
    car_plate: 'กข 4592 กรุงเทพฯ',
    car_image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    start_date: '2025-08-25',
    end_date: '2025-08-28',
    total_days: 3,
    price_per_day: 1299,
    total_price: 3897,
    status: 'คืนรถแล้ว',
    created_at: '2025-08-20 10:30',
    payment_method: 'โอนเงิน (PromptPay/Bank Transfer)',
    payment_slip: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'
  },
  {
    booking_id: 'BK-20250910',
    user_id: 'USR-001',
    user_name: 'นายพงศกร ใจดี',
    user_email: 'palm@example.com',
    user_phone: '081-234-5678',
    car_id: 'CAR-002',
    car_name: 'Honda Civic e:HEV RS',
    car_plate: 'ขก 8821 เชียงใหม่',
    car_image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    start_date: '2025-09-10',
    end_date: '2025-09-12',
    total_days: 2,
    price_per_day: 1499,
    total_price: 2998,
    status: 'รอยืนยัน',
    created_at: '2025-09-08 14:15',
    payment_method: 'โอนเงิน (PromptPay/Bank Transfer)',
    payment_slip: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'
  },
  {
    booking_id: 'BK-20250920',
    user_id: 'USR-002',
    user_name: 'นางสาวธันวา สุขเจริญ',
    user_email: 'thanwa@example.com',
    user_phone: '089-456-7890',
    car_id: 'CAR-003',
    car_name: 'Toyota Fortuner Leader 2.4 V',
    car_plate: '7กศ 1102 กรุงเทพฯ',
    car_image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    start_date: '2025-09-20',
    end_date: '2025-09-25',
    total_days: 5,
    price_per_day: 2499,
    total_price: 12495,
    status: 'กำลังใช้งาน',
    created_at: '2025-09-18 09:00',
    payment_method: 'โอนเงิน (PromptPay/Bank Transfer)',
    payment_slip: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'
  },
  {
    booking_id: 'BK-20250705',
    user_id: 'USR-002',
    user_name: 'นางสาวธันวา สุขเจริญ',
    user_email: 'thanwa@example.com',
    user_phone: '089-456-7890',
    car_id: 'CAR-004',
    car_name: 'MG ZS EV 1.5 X',
    car_plate: '8กน 3310 ชลบุรี',
    car_image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    start_date: '2025-07-05',
    end_date: '2025-07-07',
    total_days: 2,
    price_per_day: 1599,
    total_price: 3198,
    status: 'คืนรถแล้ว',
    created_at: '2025-07-01 16:20',
    payment_method: 'โอนเงิน (PromptPay/Bank Transfer)',
    payment_slip: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'
  }
];

export const INITIAL_PAYMENTS = [
  {
    payment_id: 'PAY-8801',
    booking_id: 'BK-20250801',
    amount: 3897,
    payment_date: '2025-08-20 10:35',
    payment_status: 'อนุมัติแล้ว',
    ref_number: 'TXN-99812401'
  },
  {
    payment_id: 'PAY-8802',
    booking_id: 'BK-20250910',
    amount: 2998,
    payment_date: '2025-09-08 14:20',
    payment_status: 'รอยืนยัน',
    ref_number: 'TXN-99812402'
  },
  {
    payment_id: 'PAY-8803',
    booking_id: 'BK-20250920',
    amount: 12495,
    payment_date: '2025-09-18 09:05',
    payment_status: 'อนุมัติแล้ว',
    ref_number: 'TXN-99812403'
  }
];

export const ADMIN_ANALYTICS = {
  monthlyRevenue: [
    { month: 'ม.ค.', revenue: 42000, bookings: 14 },
    { month: 'ก.พ.', revenue: 58000, bookings: 19 },
    { month: 'มี.ค.', revenue: 64000, bookings: 22 },
    { month: 'เม.ย.', revenue: 95000, bookings: 31 },
    { month: 'พ.ค.', revenue: 72000, bookings: 24 },
    { month: 'มิ.ย.', revenue: 81000, bookings: 27 },
    { month: 'ก.ค.', revenue: 89000, bookings: 29 },
    { month: 'ส.ค.', revenue: 104500, bookings: 35 },
    { month: 'ก.ย.', revenue: 118450, bookings: 38 }
  ],
  carTypeDistribution: [
    { name: 'Sedan', count: 3, percentage: 35 },
    { name: 'SUV', count: 3, percentage: 35 },
    { name: 'EV', count: 1, percentage: 12 },
    { name: 'Truck', count: 1, percentage: 10 },
    { name: 'MPV', count: 1, percentage: 8 }
  ]
};
