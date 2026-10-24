# 🚗 DriveNow - Car & Motorcycle Rental System

ระบบบริหารจัดการและจองเช่ารถยนต์และรถจักรยานยนต์ออนไลน์ (DriveNow) พัฒนาด้วย React + Tailwind CSS และ Node.js Express ร่วมกับฐานข้อมูลเชิงสัมพันธ์ MySQL (พร้อมความปลอดภัย Bcrypt Hashing, JWT HttpOnly Cookie และ Role-Based Access Control)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Backend:** Node.js, Express 5, MySQL2 (Connection Pool), JWT, Bcryptjs, Cookie-Parser
- **Database:** MySQL 8.0+ (Relational Database: Users, Cars, Bookings, Payments)

---

## 🚀 ขั้นตอนการติดตั้งและรันโปรเจกต์ (Installation & Running)

### 1. ติดตั้ง Dependencies
เปิด Terminal ที่โฟลเดอร์รากของโปรเจกต์ (`/car`):
```bash
npm install
```

### 2. ตั้งค่าฐานข้อมูล MySQL
คุณสามารถเลือกเตรียมฐานข้อมูลได้ 2 วิธี:

- **วิธีที่ 1 (นำเข้า SQL โดยตรง):**
  นำเข้าไฟล์ [database.sql](file:///e:/car/database.sql) เข้า MySQL ผ่าน MySQL Workbench, phpMyAdmin หรือ MySQL CLI:
  ```bash
  mysql -u root -p < database.sql
  ```

- **วิธีที่ 2 (รันสคริปต์ Sync อัตโนมัติ):**
  ตรวจสอบรหัสผ่าน MySQL ในไฟล์ `.env` แล้วรัน:
  ```bash
  npm run db:sync
  ```

### 3. ตรวจสอบการตั้งค่า Environment Variables (.env)
โปรเจกต์มีไฟล์ [`.env`](file:///e:/car/.env) และ [`.env.example`](file:///e:/car/.env.example) เตรียมไว้ให้แล้ว หาก MySQL ในเครื่องใช้รหัสผ่านอื่น สามารถแก้ไขได้ตามต้องการ:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=drivenow_db

PORT=5000
JWT_SECRET=drivenow_super_secret_jwt_key_2026
```

### 4. สตาร์ทเซิร์ฟเวอร์ Backend
เปิด Terminal ใหม่แล้วรันคำสั่ง:
```bash
npm run server
```
*Backend API จะทำงานที่พอร์ต `http://localhost:5000`*

### 5. สตาร์ทเว็บแอปพลิเคชัน Frontend
เปิดอีก Terminal หนึ่งแล้วรันคำสั่ง:
```bash
npm run dev
```
*Frontend จะเปิดใช้งานที่ `http://localhost:5173`*

---

## 👤 บัญชีผู้ใช้สำหรับการทดสอบ (Test Accounts)

สามารถล็อกอินได้ทั้ง **Username**, **Email** หรือคลิกปุ่ม **Quick One-Click Test Accounts** ในหน้าเข้าสู่ระบบ:

| บทบาท (Role) | Username | Email | รหัสผ่าน (Password) | สิทธิ์การเข้าถึง |
| :--- | :--- | :--- | :--- | :--- |
| **Admin (ผู้ดูแลระบบ)** | `andmin` | `andmin@drivenow.com` | `1234` | แดชบอร์ดแอดมิน, จัดการรถยนต์, อนุมัติการจอง/การคืนรถ, บัญชีผู้ใช้ |
| **Customer (ลูกค้าทั่วไป)** | `User` | `user@drivenow.com` | `1234` | ค้นหารถ, จองรถยนต์/มอเตอร์ไซค์, อัปโหลดสลิป, รีวิวการใช้งาน |
| **Customer (ลูกค้าทั่วไป)** | `palm` | `palm@example.com` | `1234` | จองรถ, ตรวจสอบประวัติการเช่า |
| **Customer (ลูกค้าทั่วไป)** | `thanwa` | `thanwa@example.com` | `1234` | จองรถ, ตรวจสอบประวัติการเช่า |
