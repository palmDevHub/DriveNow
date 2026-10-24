const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'drivenow_db'
};

async function initDatabase() {
  console.log('Connecting to MySQL...');
  const connection = await mysql.createConnection({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS drivenow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
  await connection.changeUser({ database: 'drivenow_db' });
  console.log('Connected to drivenow_db');

  // Disable FK checks temporarily for clean migration
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  await connection.query('DROP TABLE IF EXISTS payments');
  await connection.query('DROP TABLE IF EXISTS bookings');
  await connection.query('DROP TABLE IF EXISTS cars');
  await connection.query('DROP TABLE IF EXISTS users');
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');

  // 1. Users Table
  console.log('Creating users table...');
  await connection.query(`
    CREATE TABLE users (
      user_id VARCHAR(50) NOT NULL,
      username VARCHAR(50) DEFAULT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20) DEFAULT NULL,
      role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
      id_card VARCHAR(50) DEFAULT NULL,
      driver_license VARCHAR(50) DEFAULT NULL,
      avatar TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Cars Table
  console.log('Creating cars table...');
  await connection.query(`
    CREATE TABLE cars (
      car_id VARCHAR(50) NOT NULL,
      vehicle_type VARCHAR(20) NOT NULL DEFAULT 'Car',
      brand VARCHAR(50) NOT NULL,
      model VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      price_per_day DECIMAL(10, 2) NOT NULL,
      status ENUM('ว่าง', 'ถูกจอง', 'กำลังเช่า', 'ซ่อม') NOT NULL DEFAULT 'ว่าง',
      seats INT NOT NULL DEFAULT 5,
      transmission VARCHAR(50) DEFAULT 'ออโต้',
      fuel VARCHAR(50) DEFAULT 'เบนซิน',
      year INT DEFAULT 2024,
      plate_number VARCHAR(50) DEFAULT NULL,
      image TEXT DEFAULT NULL,
      description TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (car_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. Bookings Table (Relational with Foreign Keys to users and cars)
  console.log('Creating bookings table...');
  await connection.query(`
    CREATE TABLE bookings (
      booking_id VARCHAR(50) NOT NULL,
      user_id VARCHAR(50) NOT NULL,
      car_id VARCHAR(50) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      total_days INT NOT NULL,
      price_per_day DECIMAL(10, 2) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status ENUM('รอชำระเงิน', 'รอยืนยัน', 'ยืนยันแล้ว', 'กำลังใช้งาน', 'คืนรถแล้ว', 'ยกเลิก') NOT NULL DEFAULT 'รอยืนยัน',
      payment_method VARCHAR(100) DEFAULT 'โอนเงิน (PromptPay/Bank Transfer)',
      payment_slip TEXT DEFAULT NULL,
      has_reviewed BOOLEAN DEFAULT FALSE,
      rating INT DEFAULT NULL,
      review_comment TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (booking_id),
      CONSTRAINT fk_bookings_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_bookings_cars FOREIGN KEY (car_id) REFERENCES cars (car_id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. Payments Table (Relational with Foreign Key to bookings)
  console.log('Creating payments table...');
  await connection.query(`
    CREATE TABLE payments (
      payment_id VARCHAR(50) NOT NULL,
      booking_id VARCHAR(50) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      payment_status ENUM('รอยืนยัน', 'อนุมัติแล้ว', 'ปฏิเสธ') NOT NULL DEFAULT 'รอยืนยัน',
      ref_number VARCHAR(100) DEFAULT NULL,
      PRIMARY KEY (payment_id),
      CONSTRAINT fk_payments_bookings FOREIGN KEY (booking_id) REFERENCES bookings (booking_id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Hash passwords using bcryptjs
  console.log('Hashing passwords with bcryptjs...');
  const hashPass1234 = await bcrypt.hash('1234', 10);
  const hashPassDefault = await bcrypt.hash('password123', 10);

  // Seed Users
  console.log('Seeding users...');
  const users = [
    ['USR-USER', 'User', 'User (ลูกค้าทั่วไป)', 'user@drivenow.com', hashPass1234, '081-234-5678', 'customer', '1-1002-99881-22-3', 'DL-99182347', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'],
    ['USR-ADMIN', 'andmin', 'Admin (ผู้ดูแลระบบ)', 'andmin@drivenow.com', hashPass1234, '02-777-8899', 'admin', '1-0000-00000-00-0', 'DL-ADMIN001', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'],
    ['USR-001', 'palm', 'นายพงศกร ใจดี', 'palm@example.com', hashPassDefault, '081-234-5678', 'customer', '1-1002-99881-22-3', 'DL-99182347', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'],
    ['USR-002', 'thanwa', 'นางสาวธันวา สุขเจริญ', 'thanwa@example.com', hashPassDefault, '089-456-7890', 'customer', '3-9812-44123-11-9', 'DL-44819231', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80']
  ];

  for (const u of users) {
    await connection.query(
      `INSERT INTO users (user_id, username, name, email, password, phone, role, id_card, driver_license, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      u
    );
  }

  // Seed Cars
  console.log('Seeding cars...');
  const cars = [
    ['CAR-001', 'Car', 'Toyota', 'ATIV', 'Sedan', 1299.00, 'ว่าง', 5, 'ออโต้ (CVT)', 'เบนซิน-ไฮบริด', 2024, 'กข 4592 สงขลา', '/Car1.jpg', 'รถซีดานขนาดกลางประหยัดน้ำมัน ขับนุ่มเงียบ เหมาะสำหรับการเดินทางในเมืองและท่องเที่ยวต่างจังหวัด'],
    ['CAR-002', 'Car', 'Toyota', 'ATIV', 'Sedan', 1499.00, 'ว่าง', 5, 'ออโต้ (e-CVT)', 'ไฮบริด', 2024, 'ขก 8821 สงขลา', '/Car2.jpg', 'ดีไซน์สปอร์ตหรูหรา ขุมพลังไฮบริดตอบสนองทันใจ สมรรถนะเยี่ยม พร้อมระบบความปลอดภัย Honda SENSING'],
    ['CAR-003', 'Car', 'Toyota', 'ATIV', 'Sedan', 1299.00, 'ว่าง', 5, 'ออโต้ (CVT)', 'เบนซิน', 2024, '7กศ 1102 สงขลา', '/Car3.jpg', 'รถยนต์ซีดานดีไซน์สปอร์ต ขับขี่สบาย ประหยัดน้ำมัน'],
    ['MT-001', 'Mt', 'Yamaha', 'Fazzio', 'Scooter', 400.00, 'ว่าง', 2, 'ออโต้', 'เบนซิน', 2023, '1กย 8821 สงขลา', '/Mt1.jpg', 'มอเตอร์ไซค์ออโตเมติกยอดนิยม ขับขี่สบาย ประหยัดน้ำมัน'],
    ['MT-002', 'Mt', 'Honda', 'Wave 110i', 'Scooter', 300.00, 'ว่าง', 2, 'ออโต้', 'เบนซิน', 2023, '2กข 4412 สงขลา', '/Mt2.jpg', 'บิ๊กสกู๊ตเตอร์ดีไซน์สปอร์ต เครื่องยนต์แรง'],
    ['MT-003', 'Mt', 'Honda', 'Giorno', 'Scooter', 450.00, 'ว่าง', 2, 'ออโต้', 'เบนซิน', 2023, '3กศ 9901 สงขลา', '/Mt3.jpg', 'สกู๊ตเตอร์คลาสสิกดีไซน์พรีเมียม ขับขี่โดดเด่นไม่ซ้ำใคร']
  ];

  for (const c of cars) {
    await connection.query(
      `INSERT INTO cars (car_id, vehicle_type, brand, model, type, price_per_day, status, seats, transmission, fuel, year, plate_number, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      c
    );
  }

  // Seed Bookings
  console.log('Seeding bookings...');
  const bookings = [
    ['BK-20250801', 'USR-001', 'CAR-001', '2025-08-25', '2025-08-28', 3, 1299.00, 3897.00, 'คืนรถแล้ว', 'โอนเงิน (PromptPay/Bank Transfer)', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'],
    ['BK-20250910', 'USR-001', 'CAR-002', '2025-09-10', '2025-09-12', 2, 1499.00, 2998.00, 'รอยืนยัน', 'โอนเงิน (PromptPay/Bank Transfer)', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'],
    ['BK-20250920', 'USR-002', 'CAR-003', '2025-09-20', '2025-09-25', 5, 1299.00, 6495.00, 'ยืนยันแล้ว', 'โอนเงิน (PromptPay/Bank Transfer)', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80']
  ];

  for (const b of bookings) {
    await connection.query(
      `INSERT INTO bookings (booking_id, user_id, car_id, start_date, end_date, total_days, price_per_day, total_price, status, payment_method, payment_slip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      b
    );
  }

  // Seed Payments
  console.log('Seeding payments...');
  const payments = [
    ['PAY-8801', 'BK-20250801', 3897.00, 'อนุมัติแล้ว', 'TXN-99812401'],
    ['PAY-8802', 'BK-20250910', 2998.00, 'รอยืนยัน', 'TXN-99812402'],
    ['PAY-8803', 'BK-20250920', 6495.00, 'อนุมัติแล้ว', 'TXN-99812403']
  ];

  for (const p of payments) {
    await connection.query(
      `INSERT INTO payments (payment_id, booking_id, amount, payment_status, ref_number) VALUES (?, ?, ?, ?, ?)`,
      p
    );
  }

  console.log('✅ Database initialized successfully with 4 Relational Tables, Foreign Keys, and bcrypt-hashed passwords!');
  await connection.end();
}

initDatabase().catch(err => {
  console.error('❌ Failed to initialize database:', err);
  process.exit(1);
});
