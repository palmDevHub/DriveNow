

CREATE DATABASE IF NOT EXISTS drivenow_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE drivenow_db;

-- ------------------------------------------------------------
-- 1. Table Structure for `users`
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  `id_card` VARCHAR(50) DEFAULT NULL,
  `driver_license` VARCHAR(50) DEFAULT NULL,
  `avatar` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Table Structure for `cars`
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cars` (
  `car_id` VARCHAR(50) NOT NULL,
  `brand` VARCHAR(50) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `price_per_day` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('ว่าง', 'ถูกจอง', 'กำลังเช่า', 'ซ่อม') NOT NULL DEFAULT 'ว่าง',
  `seats` INT NOT NULL DEFAULT 5,
  `transmission` VARCHAR(50) DEFAULT 'ออโต้',
  `fuel` VARCHAR(50) DEFAULT 'เบนซิน',
  `year` INT DEFAULT 2024,
  `plate_number` VARCHAR(50) DEFAULT NULL,
  `image` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`car_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Table Structure for `bookings`
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `booking_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `car_id` VARCHAR(50) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `total_days` INT NOT NULL,
  `price_per_day` DECIMAL(10, 2) NOT NULL,
  `total_price` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('รอชำระเงิน', 'รอยืนยัน', 'ยืนยันแล้ว', 'กำลังใช้งาน', 'คืนรถแล้ว', 'ยกเลิก') NOT NULL DEFAULT 'รอยืนยัน',
  `payment_method` VARCHAR(100) DEFAULT 'โอนเงิน (PromptPay)',
  `payment_slip` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `fk_bookings_users` (`user_id`),
  KEY `fk_bookings_cars` (`car_id`),
  CONSTRAINT `fk_bookings_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_cars` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Table Structure for `payments`
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` VARCHAR(50) NOT NULL,
  `booking_id` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `payment_status` ENUM('รอยืนยัน', 'อนุมัติแล้ว', 'ปฏิเสธ') NOT NULL DEFAULT 'รอยืนยัน',
  `ref_number` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payments_bookings` (`booking_id`),
  CONSTRAINT `fk_payments_bookings` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Initial Seed Data (INSERT Statements)
-- ============================================================

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `role`, `id_card`, `driver_license`, `avatar`) VALUES
('USR-001', 'นายพงศกร ใจดี', 'palm@example.com', 'password123', '081-234-5678', 'customer', '1-1002-99881-22-3', 'DL-99182347', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
('USR-002', 'นางสาวธันวา สุขเจริญ', 'thanwa@example.com', 'password123', '089-456-7890', 'customer', '3-9812-44123-11-9', 'DL-44819231', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'),
('USR-003', 'ผู้ดูแลระบบ (Admin)', 'admin@drivenow.com', 'adminpassword', '02-777-8899', 'admin', NULL, NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');

INSERT INTO `cars` (`car_id`, `brand`, `model`, `type`, `price_per_day`, `status`, `seats`, `transmission`, `fuel`, `year`, `plate_number`, `image`, `description`) VALUES
('CAR-001', 'Toyota', 'Corolla Altis 1.8 HEV', 'Sedan', 1299.00, 'ว่าง', 5, 'ออโต้ (CVT)', 'เบนซิน-ไฮบริด', 2024, 'กข 4592 กรุงเทพฯ', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80', 'รถซีดานขนาดกลางประหยัดน้ำมัน ขับนุ่มเงียบ เหมาะสำหรับการเดินทางในเมือง'),
('CAR-002', 'Honda', 'Civic e:HEV RS', 'Sedan', 1499.00, 'ว่าง', 5, 'ออโต้ (e-CVT)', 'ไฮบริด', 2024, 'ขก 8821 เชียงใหม่', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80', 'ดีไซน์สปอร์ตหรูหรา ขุมพลังไฮบริดตอบสนองทันใจ สมรรถนะเยี่ยม'),
('CAR-003', 'Toyota', 'Fortuner Leader 2.4 V', 'SUV', 2499.00, 'ว่าง', 7, 'ออโต้ 6 สปีด', 'ดีเซล', 2023, '7กศ 1102 กรุงเทพฯ', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', 'รถ SUV 7 ที่นั่ง ลุยได้ทุกสภาพถนน พื้นที่ห้องโดยสารกว้างขวาง'),
('CAR-004', 'MG', 'ZS EV 1.5 X', 'SUV', 1599.00, 'ถูกจอง', 5, 'ออโต้', 'ไฟฟ้า 100%', 2023, '8กน 3310 ชลบุรี', 'https://images.unsplash.com/photo-1541348263662-e082662dc324?auto=format&fit=crop&w=800&q=80', 'สมาร์ท SUV ไฟฟ้า 100% ขับได้ไกล เงียบ ประหยัด'),
('CAR-005', 'Isuzu', 'D-Max Cab-4 Hi-Lander', 'Truck', 1799.00, 'ว่าง', 5, 'ออโต้ 6 สปีด', 'ดีเซล', 2023, 'ผข 9912 นครราชสีมา', 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80', 'รถกระบะ 4 ประตู ยกสูง ขนของแรงดี ทรหด ทนทาน');

INSERT INTO `bookings` (`booking_id`, `user_id`, `car_id`, `start_date`, `end_date`, `total_days`, `price_per_day`, `total_price`, `status`, `payment_method`, `payment_slip`) VALUES
('BK-20250801', 'USR-001', 'CAR-001', '2025-08-25', '2025-08-28', 3, 1299.00, 3897.00, 'ยืนยันแล้ว', 'โอนเงิน (PromptPay)', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80'),
('BK-20250910', 'USR-001', 'CAR-002', '2025-09-10', '2025-09-12', 2, 1499.00, 2998.00, 'รอยืนยัน', 'โอนเงิน (PromptPay)', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=500&q=80');

INSERT INTO `payments` (`payment_id`, `booking_id`, `amount`, `payment_status`, `ref_number`) VALUES
('PAY-8801', 'BK-20250801', 3897.00, 'อนุมัติแล้ว', 'TXN-99812401'),
('PAY-8802', 'BK-20250910', 2998.00, 'รอยืนยัน', 'TXN-99812402');
