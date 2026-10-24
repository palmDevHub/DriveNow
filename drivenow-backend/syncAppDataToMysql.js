const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'drivenow_db'
};

async function syncData() {
  console.log('🔄 เริ่มต้นอัปเดตข้อมูลแอพปัจจุบันไปยัง MySQL (drivenow_db)...');
  const conn = await mysql.createConnection(DB_CONFIG);

  // 1. Password hashes
  const hash1234 = await bcrypt.hash('1234', 10);
  const hashDefault = await bcrypt.hash('password123', 10);

  // 2. Users (อัปเดตผู้ใช้ปัจจุบันทั้งหมด พร้อมรหัสผ่าน bcrypt)
  const users = [
    {
      user_id: 'USR-USER',
      username: 'User',
      name: 'User (ลูกค้าทั่วไป)',
      email: 'user@drivenow.com',
      password: hash1234,
      phone: '081-234-5678',
      role: 'customer',
      id_card: '1-1002-99881-22-3',
      driver_license: 'DL-99182347',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    },
    {
      user_id: 'USR-ADMIN',
      username: 'andmin',
      name: 'Admin (ผู้ดูแลระบบ)',
      email: 'andmin@drivenow.com',
      password: hash1234,
      phone: '02-777-8899',
      role: 'admin',
      id_card: '1-0000-00000-00-0',
      driver_license: 'DL-ADMIN001',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    {
      user_id: 'USR-001',
      username: 'palm',
      name: 'นายพงศกร ใจดี',
      email: 'palm@example.com',
      password: hash1234,
      phone: '081-234-5678',
      role: 'customer',
      id_card: '1-1002-99881-22-3',
      driver_license: 'DL-99182347',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    {
      user_id: 'USR-002',
      username: 'thanwa',
      name: 'นางสาวธันวา สุขเจริญ',
      email: 'thanwa@example.com',
      password: hash1234,
      phone: '089-456-7890',
      role: 'customer',
      id_card: '3-9812-44123-11-9',
      driver_license: 'DL-44819231',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
    },
    {
      user_id: 'USR-003',
      username: 'palm45',
      name: 'พงศกร อินชุม',
      email: 'palm45@gmail.com',
      password: hash1234,
      phone: '088-765-4321',
      role: 'customer',
      id_card: '1-9002-44123-88-2',
      driver_license: 'DL-88192341',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    }
  ];

  console.log('📦 กำลังบันทึกข้อมูล Users ลง MySQL...');
  for (const u of users) {
    await conn.query(`
      INSERT INTO users (user_id, username, name, email, password, phone, role, id_card, driver_license, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        username = VALUES(username),
        name = VALUES(name),
        password = VALUES(password),
        phone = VALUES(phone),
        role = VALUES(role),
        id_card = VALUES(id_card),
        driver_license = VALUES(driver_license),
        avatar = VALUES(avatar)
    `, [u.user_id, u.username, u.name, u.email, u.password, u.phone, u.role, u.id_card, u.driver_license, u.avatar]);
  }

  // 3. Cars (อัปเดตรถยนต์และมอเตอร์ไซค์ปัจจุบันของแอพ ทั้ง 6 คัน ให้มีข้อมูลครบและสถานะเป็น "ว่าง")
  const cars = [
    {
      car_id: 'CAR-001',
      vehicle_type: 'Car',
      brand: 'Toyota',
      model: 'ATIV',
      type: 'Sedan',
      price_per_day: 1299.00,
      status: 'ว่าง',
      seats: 5,
      transmission: 'ออโต้ (CVT)',
      fuel: 'เบนซิน-ไฮบริด',
      year: 2024,
      plate_number: 'กข 4592 สงขลา',
      image: '/Car1.jpg',
      description: 'รถซีดานขนาดกลางประหยัดน้ำมัน ขับนุ่มเงียบ เหมาะสำหรับการเดินทางในเมืองและท่องเที่ยวต่างจังหวัด'
    },
    {
      car_id: 'CAR-002',
      vehicle_type: 'Car',
      brand: 'Toyota',
      model: 'ATIV',
      type: 'Sedan',
      price_per_day: 1499.00,
      status: 'ว่าง',
      seats: 5,
      transmission: 'ออโต้ (e-CVT)',
      fuel: 'ไฮบริด',
      year: 2024,
      plate_number: 'ขก 8821 สงขลา',
      image: '/Car2.jpg',
      description: 'ดีไซน์สปอร์ตหรูหรา ขุมพลังไฮบริดตอบสนองทันใจ สมรรถนะเยี่ยม พร้อมระบบความปลอดภัย Honda SENSING'
    },
    {
      car_id: 'CAR-003',
      vehicle_type: 'Car',
      brand: 'Toyota',
      model: 'ATIV',
      type: 'Sedan',
      price_per_day: 1299.00,
      status: 'ว่าง',
      seats: 5,
      transmission: 'ออโต้ (CVT)',
      fuel: 'เบนซิน',
      year: 2024,
      plate_number: '7กศ 1102 สงขลา',
      image: '/Car3.jpg',
      description: 'รถยนต์ซีดานดีไซน์สปอร์ต ขับขี่สบาย ประหยัดน้ำมัน'
    },
    {
      car_id: 'MT-001',
      vehicle_type: 'Mt',
      brand: 'Yamaha',
      model: 'Fazzio',
      type: 'Scooter',
      price_per_day: 400.00,
      status: 'ว่าง',
      seats: 2,
      transmission: 'ออโต้',
      fuel: 'เบนซิน',
      year: 2023,
      plate_number: '1กย 8821 สงขลา',
      image: '/Mt1.jpg',
      description: 'มอเตอร์ไซค์ออโตเมติกยอดนิยม ขับขี่สบาย ประหยัดน้ำมัน'
    },
    {
      car_id: 'MT-002',
      vehicle_type: 'Mt',
      brand: 'Honda',
      model: 'Wave 110i',
      type: 'Scooter',
      price_per_day: 300.00,
      status: 'ว่าง',
      seats: 2,
      transmission: 'ออโต้',
      fuel: 'เบนซิน',
      year: 2023,
      plate_number: '2กข 4412 สงขลา',
      image: '/Mt2.jpg',
      description: 'บิ๊กสกู๊ตเตอร์ดีไซน์สปอร์ต เครื่องยนต์แรง'
    },
    {
      car_id: 'MT-003',
      vehicle_type: 'Mt',
      brand: 'Honda',
      model: 'Giorno',
      type: 'Scooter',
      price_per_day: 450.00,
      status: 'ว่าง',
      seats: 2,
      transmission: 'ออโต้',
      fuel: 'เบนซิน',
      year: 2023,
      plate_number: '3กศ 9901 สงขลา',
      image: '/Mt3.jpg',
      description: 'สกู๊ตเตอร์คลาสสิกดีไซน์พรีเมียม ขับขี่โดดเด่นไม่ซ้ำใคร'
    }
  ];

  console.log('🚗 กำลังบันทึกข้อมูลรถยนต์/มอเตอร์ไซค์ลง MySQL...');
  for (const c of cars) {
    await conn.query(`
      INSERT INTO cars (car_id, vehicle_type, brand, model, type, price_per_day, status, seats, transmission, fuel, year, plate_number, image, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        vehicle_type = VALUES(vehicle_type),
        brand = VALUES(brand),
        model = VALUES(model),
        type = VALUES(type),
        price_per_day = VALUES(price_per_day),
        status = VALUES(status),
        seats = VALUES(seats),
        transmission = VALUES(transmission),
        fuel = VALUES(fuel),
        year = VALUES(year),
        plate_number = VALUES(plate_number),
        image = VALUES(image),
        description = VALUES(description)
    `, [c.car_id, c.vehicle_type, c.brand, c.model, c.type, c.price_per_day, c.status, c.seats, c.transmission, c.fuel, c.year, c.plate_number, c.image, c.description]);
  }

  // 4. Bookings (อัปเดตการจองปัจจุบัน พร้อมสถานะและการรีวิว)
  const bookings = [
    {
      booking_id: 'BK-20250801',
      user_id: 'USR-001',
      car_id: 'CAR-001',
      start_date: '2025-08-25',
      end_date: '2025-08-28',
      total_days: 3,
      price_per_day: 1299.00,
      total_price: 3897.00,
      status: 'คืนรถแล้ว',
      payment_method: 'โอนเงิน (PromptPay/Bank Transfer)',
      payment_slip: '/demo-payment-slip.svg',
      has_reviewed: 1,
      rating: 5,
      review_comment: 'รถสภาพดีมาก สะอาด ขับนิ่ม ประหยัดน้ำมัน บริการประทับใจมากครับ'
    },
    {
      booking_id: 'BK-20250910',
      user_id: 'USR-001',
      car_id: 'CAR-002',
      start_date: '2025-09-10',
      end_date: '2025-09-12',
      total_days: 2,
      price_per_day: 1499.00,
      total_price: 2998.00,
      status: 'รอยืนยัน',
      payment_method: 'โอนเงิน (PromptPay/Bank Transfer)',
      payment_slip: '/demo-payment-slip.svg',
      has_reviewed: 0,
      rating: null,
      review_comment: null
    },
    {
      booking_id: 'BK-20250920',
      user_id: 'USR-002',
      car_id: 'CAR-003',
      start_date: '2025-09-20',
      end_date: '2025-09-25',
      total_days: 5,
      price_per_day: 1299.00,
      total_price: 6495.00,
      status: 'ยืนยันแล้ว',
      payment_method: 'โอนเงิน (PromptPay/Bank Transfer)',
      payment_slip: '/demo-payment-slip.svg',
      has_reviewed: 0,
      rating: null,
      review_comment: null
    }
  ];

  console.log('📋 กำลังบันทึกข้อมูลการจอง (Bookings) ลง MySQL...');
  for (const b of bookings) {
    await conn.query(`
      INSERT INTO bookings (booking_id, user_id, car_id, start_date, end_date, total_days, price_per_day, total_price, status, payment_method, payment_slip, has_reviewed, rating, review_comment)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        car_id = VALUES(car_id),
        start_date = VALUES(start_date),
        end_date = VALUES(end_date),
        total_days = VALUES(total_days),
        price_per_day = VALUES(price_per_day),
        total_price = VALUES(total_price),
        status = VALUES(status),
        payment_method = VALUES(payment_method),
        payment_slip = VALUES(payment_slip),
        has_reviewed = VALUES(has_reviewed),
        rating = VALUES(rating),
        review_comment = VALUES(review_comment)
    `, [b.booking_id, b.user_id, b.car_id, b.start_date, b.end_date, b.total_days, b.price_per_day, b.total_price, b.status, b.payment_method, b.payment_slip, b.has_reviewed, b.rating, b.review_comment]);
  }

  // 5. Payments (อัปเดตการชำระเงิน)
  const payments = [
    { payment_id: 'PAY-8801', booking_id: 'BK-20250801', amount: 3897.00, payment_status: 'อนุมัติแล้ว', ref_number: 'TXN-99812401' },
    { payment_id: 'PAY-8802', booking_id: 'BK-20250910', amount: 2998.00, payment_status: 'รอยืนยัน', ref_number: 'TXN-99812402' },
    { payment_id: 'PAY-8803', booking_id: 'BK-20250920', amount: 6495.00, payment_status: 'อนุมัติแล้ว', ref_number: 'TXN-99812403' }
  ];

  console.log('💳 กำลังบันทึกข้อมูล Payments ลง MySQL...');
  for (const p of payments) {
    await conn.query(`
      INSERT INTO payments (payment_id, booking_id, amount, payment_status, ref_number)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        booking_id = VALUES(booking_id),
        amount = VALUES(amount),
        payment_status = VALUES(payment_status),
        ref_number = VALUES(ref_number)
    `, [p.payment_id, p.booking_id, p.amount, p.payment_status, p.ref_number]);
  }

  console.log('✅ อัปเดตข้อมูลทั้งหมดลงใน MySQL สำเร็จเรียบร้อยแล้ว!');
  await conn.end();
}

syncData().catch(err => {
  console.error('❌ เกิดข้อผิดพลาดในการอัปเดตข้อมูลลง MySQL:', err);
  process.exit(1);
});
