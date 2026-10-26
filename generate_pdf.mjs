import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve('pdf_artifacts');
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');
const FINAL_PDF_PATH = path.resolve('DriveNow_App_Screenshots.pdf');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureScreenshots(page) {
  console.log('🌐 Navigating to DriveNow web app:', BASE_URL);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await sleep(1500);

  // 1. Home Page (Hero & Fleet Overview)
  console.log('📸 1. Capturing Home Page...');
  await page.evaluate(() => {
    window.__app.setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_home.png'), fullPage: false });

  // 2. Cars Catalog Page (All Vehicles & Category Filters)
  console.log('📸 2. Capturing Cars Catalog Page...');
  await page.evaluate(() => {
    window.__app.setCurrentView('cars');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_cars.png'), fullPage: false });

  // 3. Car Detail Page (Toyota ATIV & Province Pricing)
  console.log('📸 3. Capturing Car Detail Page...');
  await page.evaluate(() => {
    const firstCar = window.__app.cars[0];
    window.__app.handleSelectCarForBooking(firstCar);
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_car_detail.png'), fullPage: false });

  // LOGIN AS CUSTOMER FOR CHECKOUT & BOOKING FLOWS
  console.log('🔑 Logging in as Customer (User)...');
  await page.evaluate(async () => {
    await window.__app.login('User', '1234');
    const car = window.__app.cars[0];
    window.__app.setBookingDraft({
      car: car,
      startDate: '2026-10-26',
      endDate: '2026-10-29',
      totalDays: 3,
      provinceId: 'songkhla',
      provinceName: 'สงขลา - หาดใหญ่',
      pricePerDay: 1000,
      rentalPrice: 3000,
      deposit: 5000,
      totalPrice: 8000
    });
    window.__app.setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(1000);

  // 4. Checkout Step 1 - Form & Identification
  console.log('📸 4. Capturing Checkout Step 1 (Driver Info)...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_checkout_step1.png'), fullPage: false });

  // 5. Checkout Step 2 - Payment & QR Code
  console.log('📸 5. Capturing Checkout Step 2 (QR Payment)...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const nextBtn = buttons.find(b => b.textContent.includes('ดำเนินการชำระเงิน') || b.textContent.includes('ชำระเงิน') || b.type === 'submit');
    if (nextBtn) nextBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_checkout_step2.png'), fullPage: false });

  // 6. Checkout Step 3 - Booking Complete
  console.log('📸 6. Capturing Checkout Step 3 (Success)...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const confirmBtn = buttons.find(b => b.textContent.includes('ยืนยันการชำระเงิน') || b.textContent.includes('ยืนยันการจอง') || b.textContent.includes('Confirm'));
    if (confirmBtn) confirmBtn.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_checkout_step3.png'), fullPage: false });

  // 7. My Bookings Page (Customer Rental History & Reviews)
  console.log('📸 7. Capturing My Bookings Page...');
  await page.evaluate(() => {
    window.__app.setCurrentView('my-bookings');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_my_bookings.png'), fullPage: false });

  // 8. Profile Page (Customer Personal Details)
  console.log('📸 8. Capturing Profile Page...');
  await page.evaluate(() => {
    window.__app.setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_profile.png'), fullPage: false });

  // 9. Login Page (with Quick 1-Click Test Accounts)
  console.log('📸 9. Capturing Login Page...');
  await page.evaluate(() => {
    window.__app.logout();
    window.__app.setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_login.png'), fullPage: false });

  // 10. Register Page
  console.log('📸 10. Capturing Register Page...');
  await page.evaluate(() => {
    window.__app.setCurrentView('register');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_register.png'), fullPage: false });

  // LOGIN AS ADMIN
  console.log('🔑 Logging in as Admin (andmin)...');
  await page.evaluate(async () => {
    await window.__app.login('andmin', '1234');
    window.__app.setCurrentView('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(1500);

  // 11. Admin Dashboard (KPI Metrics & Charts)
  console.log('📸 11. Capturing Admin Dashboard...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_admin_dashboard.png'), fullPage: false });

  // 12. Admin Cars Page (Fleet CRUD Table)
  console.log('📸 12. Capturing Admin Cars Page...');
  await page.evaluate(() => {
    window.__app.setCurrentView('admin-cars');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_admin_cars.png'), fullPage: false });

  // 13. Admin Add Car Modal
  console.log('📸 13. Capturing Admin Add Car Modal...');
  await page.evaluate(() => {
    const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('เพิ่มรถใหม่') || b.textContent.includes('Add New Car'));
    if (addBtn) addBtn.click();
  });
  await sleep(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_admin_car_modal.png'), fullPage: false });

  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button .lucide-x')?.parentElement || document.querySelector('button[title="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(400);

  // 14. Admin Bookings Page
  console.log('📸 14. Capturing Admin Bookings Page...');
  await page.evaluate(() => {
    window.__app.setCurrentView('admin-bookings');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_admin_bookings.png'), fullPage: false });

  // 15. Admin Bookings Slip Verification Modal
  console.log('📸 15. Capturing Admin Slip Verification Modal...');
  await page.evaluate(() => {
    const viewSlipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ดูสลิป') || b.textContent.includes('View Slip'));
    if (viewSlipBtn) viewSlipBtn.click();
  });
  await sleep(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_admin_slip_modal.png'), fullPage: false });

  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button .lucide-x')?.parentElement;
    if (closeBtn) closeBtn.click();
  });
  await sleep(400);

  // 16. Admin Users Page
  console.log('📸 16. Capturing Admin Users Page...');
  await page.evaluate(() => {
    window.__app.setCurrentView('admin-users');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '16_admin_users.png'), fullPage: false });
}

function getBase64Image(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const bitmap = fs.readFileSync(filePath);
    return `data:image/png;base64,${bitmap.toString('base64')}`;
  }
  return '';
}

function generatePresentationHtml() {
  console.log('🎨 Generating Presentation HTML with Base64 embedded screenshots...');

  const slidesData = [
    {
      num: '01',
      badge: 'OVERVIEW',
      badgeClass: 'badge-blue',
      title: 'หน้าแรก & ภาพรวมบริการ (Homepage & Fleet Showcase)',
      subtitle: 'จุดเริ่มต้นการจองรถของลูกค้า พร้อมแบนเนอร์โปรโมชันและแคตตาล็อกแนะนำ',
      points: [
        '<strong>แบนเนอร์ข้อเสนอพิเศษ:</strong> นำเสนอโปรโมชันเช่ารถหาดใหญ่-สงขลา พร้อมปุ่มติดต่อแฟนเพจ Facebook',
        '<strong>Popular Rentals:</strong> แสดงรายการรถยอดนิยมพร้อมราคาเริ่มต้นต่อวัน และป้ายบอกสถานะความพร้อม',
        '<strong>How It Works 3 ขั้นตอน:</strong> สรุปขั้นตอนการเช่ารถง่ายๆ เลือกรถ ➔ ยืนยันการจอง ➔ รับรถขับได้ทันที',
        '<strong>การนำทางที่รวดเร็ว:</strong> เมนูค้นหา, สลับภาษาไทย/อังกฤษ และปุ่มเข้าสู่ระบบแบบทันสมัย'
      ],
      img: '01_home.png',
      url: 'http://localhost:5173 (View: home)'
    },
    {
      num: '02',
      badge: 'CUSTOMER DISCOVERY',
      badgeClass: 'badge-blue',
      title: 'ศูนย์รวมยานพาหนะ & คัดกรองรถ (Vehicles Catalog & Filters)',
      subtitle: 'ค้นหาและกรองรถยนต์และมอเตอร์ไซค์ตามประเภท รุ่น ราคา และสเปกอย่างแม่นยำ',
      points: [
        '<strong>ตัวกรองประเภทยานพาหนะ:</strong> สลับดูระหว่าง "รถยนต์ (Car)" หรือ "รถจักรยานยนต์ (Motorcycle)"',
        '<strong>ค้นหาแบบเรียลไทม์:</strong> พิมพ์ค้นหาตามยี่ห้อ (Toyota, Honda, Yamaha), รุ่นรถ หรือป้ายทะเบียน',
        '<strong>การจัดเรียงราคา:</strong> จัดเรียงราคาจากน้อยไปมาก หรือมากไปน้อยได้อย่างรวดเร็ว',
        '<strong>สถานะพร้อมใช้งาน:</strong> แสดง Badge ชัดเจน เช่น "ว่าง", "ถูกจอง", "กำลังเช่า", "ซ่อม"'
      ],
      img: '02_cars.png',
      url: 'http://localhost:5173 (View: cars)'
    },
    {
      num: '03',
      badge: 'DYNAMIC PRICING',
      badgeClass: 'badge-purple',
      title: 'รายละเอียดรถ & คำนวณราคาตามจังหวัด (Car Details & Rates)',
      subtitle: 'สเปกรถครบถ้วน พร้อมระบบคำนวณราคาเช่าอัตโนมัติตามเส้นทางปลายทางจังหวัด',
      points: [
        '<strong>Province-based Pricing:</strong> คำนวณราคาตามโซนปลายทาง เช่น สงขลา 1,000 บ., ตรัง 1,100 บ., ภูเก็ต 1,300 บ.',
        '<strong>ปฏิทินเลือกวันเช่า:</strong> ระบุวันเริ่มต้นและสิ้นสุด ระบบคำนวณจำนวนวันเช่าให้อัตโนมัติ',
        '<strong>ยอดรวมพร้อมมัดจำ:</strong> แสดงแจกแจงค่าเช่ารวม + เงินประกันความเสียหาย (5,000 บ. สำหรับรถยนต์)',
        '<strong>สเปกและสิ่งอำนวยความสะดวก:</strong> จำนวนที่นั่ง (5 ที่นั่ง), เกียร์ออโต้ CVT, เชื้อเพลิง, ปี 2024'
      ],
      img: '03_car_detail.png',
      url: 'http://localhost:5173 (View: car-detail)'
    },
    {
      num: '04',
      badge: 'CHECKOUT FLOW: STEP 1',
      badgeClass: 'badge-amber',
      title: 'ยืนยันข้อมูลผู้เช่า & แนบเอกสาร (Checkout: Driver Details)',
      subtitle: 'ขั้นตอนที่ 1 ของการจอง: ตรวจสอบข้อมูลส่วนตัวและอัปโหลดหลักฐานผู้ขับขี่',
      points: [
        '<strong>ดึงข้อมูลอัตโนมัติ:</strong> ดึงชื่อ-นามสกุล, เบอร์โทรศัพท์ และอีเมลจากบัญชีผู้ใช้ที่ล็อกอิน',
        '<strong>อัปโหลดเอกสารสำคัญ:</strong> รองรับการแนบภาพถ่ายบัตรประชาชน และใบอนุญาตขับขี่รถยนต์',
        '<strong>สรุปสัญญาการเช่า:</strong> แสดงรุ่นรถที่เลือก, ช่วงเวลาเช่า, ปลายทางจังหวัด และยอดที่ต้องชำระ',
        '<strong>ระบบความปลอดภัยข้อมูล:</strong> ตรวจสอบขนาดไฟล์รูปภาพไม่เกิน 5MB พร้อมแจ้งเตือนชัดเจน'
      ],
      img: '04_checkout_step1.png',
      url: 'http://localhost:5173 (View: checkout - Step 1)'
    },
    {
      num: '05',
      badge: 'CHECKOUT FLOW: STEP 2',
      badgeClass: 'badge-emerald',
      title: 'ชำระเงิน & แนบสลิปโอนเงิน (Checkout: Payment & Slip Upload)',
      subtitle: 'ขั้นตอนที่ 2 ของการจอง: สแกน PromptPay QR Code หรือโอนผ่านบัญชีธนาคาร',
      points: [
        '<strong>สแกน QR Code ทันที:</strong> แสดง QR Code พร้อมเพย์ พร้อมยอดเงินที่ต้องชำระตรงตามคำนวณเป๊ะ',
        '<strong>ข้อมูลบัญชีธนาคาร:</strong> ระบุชื่อบัญชี เลขที่บัญชี และสาขา สำหรับการโอนเงินแบบปกติ',
        '<strong>อัปโหลดสลิปหลักฐาน:</strong> มีปุ่มเลือกรูปภาพสลิป พร้อมแสดงพรีวิวภาพขนาดย่อให้ตรวจทานก่อนส่ง',
        '<strong>ปุ่มกดยืนยันการชำระเงิน:</strong> ส่งข้อมูลตรงเข้าฐานข้อมูล MySQL พร้อมเปลี่ยนสถานะเป็น "รอยืนยัน"'
      ],
      img: '05_checkout_step2.png',
      url: 'http://localhost:5173 (View: checkout - Step 2)'
    },
    {
      num: '06',
      badge: 'CHECKOUT FLOW: STEP 3',
      badgeClass: 'badge-emerald',
      title: 'ยืนยันการจองสำเร็จ (Checkout: Booking Success & Confetti)',
      subtitle: 'ขั้นตอนที่ 3: ระบบออกรหัสใบจอง ยืนยันข้อมูล พร้อมเอฟเฟกต์ฉลองความสำเร็จ',
      points: [
        '<strong>รหัสการจอง (Booking ID):</strong> ออกเลขอ้างอิงเฉพาะ เช่น BK-20261025 สำหรับนำไปรับรถ',
        '<strong>Confetti Animation:</strong> แอนิเมชันกระดาษสายรุ้งสร้างความประทับใจเมื่อการจองเสร็จสมบูรณ์',
        '<strong>สรุปขั้นตอนถัดไป:</strong> แจ้งเตือนลูกค้าให้รอแอดมินตรวจสอบสลิป และเตรียมเอกสารตัวจริงในวันรับรถ',
        '<strong>ทางลัดไปหน้าประวัติ:</strong> ปุ่มคลิกเพื่อเปิดดูรายละเอียดและติดตามสถานะในหน้า My Bookings ได้ทันที'
      ],
      img: '06_checkout_step3.png',
      url: 'http://localhost:5173 (View: checkout - Step 3)'
    },
    {
      num: '07',
      badge: 'BOOKINGS & REVIEWS',
      badgeClass: 'badge-blue',
      title: 'ประวัติการจอง & การให้คะแนนรีวิว (My Bookings & Rating)',
      subtitle: 'ลูกค้าสามารถติดตามสถานะการจองทุกรายการ และเขียนรีวิวความพึงพอใจหลังคืนรถ',
      points: [
        '<strong>แถบติดตามสถานะ 5 ขั้นตอน:</strong> รอยืนยัน ➔ ยืนยันแล้ว ➔ กำลังใช้งาน ➔ คืนรถแล้ว ➔ ยกเลิก',
        '<strong>ตรวจสอบสลิปที่แนบ:</strong> ลูกค้าสามารถกดดูรูปสลิปที่ตนเองแนบไว้ได้ตลอดเวลา',
        '<strong>ระบบให้คะแนนดาว (Rating):</strong> ให้คะแนน 1-5 ดาว สำหรับสมรรถนะรถและความสะอาด',
        '<strong>รีวิวความคิดเห็น:</strong> เขียนข้อความรีวิวการใช้งานเพื่อเป็นประโยชน์แก่ผู้เช่าท่านอื่น'
      ],
      img: '07_my_bookings.png',
      url: 'http://localhost:5173 (View: my-bookings)'
    },
    {
      num: '08',
      badge: 'USER PROFILE',
      badgeClass: 'badge-purple',
      title: 'ข้อมูลโปรไฟล์ & สิทธิ์สมาชิก (Customer Profile Management)',
      subtitle: 'หน้าจัดการข้อมูลส่วนตัว บัตรประชาชน ใบขับขี่ และประวัติการเป็นสมาชิก',
      points: [
        '<strong>ข้อมูลประจำตัว:</strong> แสดงชื่อ-สกุล, อีเมล, เบอร์โทรศัพท์ และรูปภาพโปรไฟล์',
        '<strong>เอกสารยืนยันตัวตน:</strong> บันทึกเลขบัตรประชาชน และเลขที่ใบอนุญาตขับขี่รถยนต์',
        '<strong>สถานะบทบาท (Role Badge):</strong> แสดงป้ายกำกับสถานะ Customer หรือ Admin',
        '<strong>ความปลอดภัยของบัญชี:</strong> สามารถอัปเดตข้อมูลส่วนตัวและรหัสผ่านใหม่ได้อย่างปลอดภัย'
      ],
      img: '08_profile.png',
      url: 'http://localhost:5173 (View: profile)'
    },
    {
      num: '09',
      badge: 'SECURITY & AUTH',
      badgeClass: 'badge-amber',
      title: 'ระบบเข้าสู่ระบบ (Authentication & Quick Test Accounts)',
      subtitle: 'เข้าสู่ระบบอย่างปลอดภัยด้วย JWT HttpOnly Cookie พร้อมปุ่ม 1-Click สำหรับการทดสอบ',
      points: [
        '<strong>การตรวจสอบสิทธิ์ 2 รูปแบบ:</strong> สามารถล็อกอินด้วย Username หรือ Email คู่กับ Password',
        '<strong>Quick One-Click Test Accounts:</strong> ปุ่มกดคลิกเดียวสลับล็อกอิน Admin, User, Palm, Thanwa',
        '<strong>การป้องกัน XSS Attack:</strong> จัดเก็บ Session ผ่าน JWT ใน HttpOnly Cookie ปลอดภัยสูง',
        '<strong>การเชื่อมโยงระบบ:</strong> ตรวจจับบทบาทอัตโนมัติ ล็อกอิน Admin ส่งเข้าแดชบอร์ด ล็อกอิน User ส่งเข้าหน้าแรก'
      ],
      img: '09_login.png',
      url: 'http://localhost:5173 (View: login)'
    },
    {
      num: '10',
      badge: 'REGISTRATION',
      badgeClass: 'badge-blue',
      title: 'ระบบสมัครสมาชิกใหม่ (Customer Registration & Hashing)',
      subtitle: 'ลงทะเบียนสมาชิกใหม่ พร้อมระบบเข้ารหัสผ่านความปลอดภัยสูงด้วย Bcrypt',
      points: [
        '<strong>กรอกข้อมูลครบถ้วน:</strong> ชื่อ-นามสกุล, อีเมล, รหัสผ่าน, เบอร์โทรศัพท์สำหรับติดต่อ',
        '<strong>Bcrypt Password Hashing:</strong> เข้ารหัสผ่านด้วย Salt 10 รอบ ก่อนจัดเก็บลงฐานข้อมูล MySQL',
        '<strong>การป้องกัน Privilege Escalation:</strong> บังคับ Role สมาชิกใหม่เป็น "customer" เสมอเพื่อความปลอดภัย',
        '<strong>Auto Sign-in:</strong> เมื่อสมัครสำเร็จ ระบบจะสร้าง JWT และพาลูกค้าเข้าสู่ระบบโดยอัตโนมัติ'
      ],
      img: '10_register.png',
      url: 'http://localhost:5173 (View: register)'
    },
    {
      num: '11',
      badge: 'ADMIN DASHBOARD',
      badgeClass: 'badge-purple',
      title: 'ศูนย์ควบคุม & วิเคราะห์สถิติธุรกิจ (Admin Dashboard & Analytics)',
      subtitle: 'แดชบอร์ดภาพรวมสรุปผลการดำเนินงาน กราฟแนวโน้มรายได้ และสัดส่วนการจองรถ',
      points: [
        '<strong>4 KPI Cards สรุปด่วน:</strong> จำนวนรถทั้งหมด (ว่าง/ถูกเช่า), รายการจอง, รายได้รวม (บาท), สมาชิก',
        '<strong>Area Chart วิเคราะห์รายได้:</strong> กราฟเส้นแสดงแนวโน้มยอดเงินที่ได้รับการอนุมัติแล้ว',
        '<strong>Pie Chart สัดส่วนสถานะการจอง:</strong> แผนภูมิวงกลมแสดงสัดส่วน รอยืนยัน, ยืนยันแล้ว, กำลังเช่า, คืนรถ',
        '<strong>ปุ่มคีย์ลัดการจัดการ:</strong> ปุ่มกดด่วนสำหรับ "เพิ่มรถใหม่" และดูรายการจองที่ต้องตรวจสอบ'
      ],
      img: '11_admin_dashboard.png',
      url: 'http://localhost:5173 (View: admin-dashboard)'
    },
    {
      num: '12',
      badge: 'ADMIN OPERATIONS',
      badgeClass: 'badge-blue',
      title: 'ระบบจัดการกองรถยนต์ & มอเตอร์ไซค์ (Vehicle Fleet CRUD)',
      subtitle: 'ตารางบริหารจัดการยานพาหนะ เพิ่ม ลบ แก้ไขสเปก และปรับสถานะความพร้อมของรถ',
      points: [
        '<strong>ตารางแสดงสเปกครบครัน:</strong> ภาพรถ, รุ่น, ประเภท, ทะเบียน, ราคาต่อวัน และสถานะปัจจุบัน',
        '<strong>ตัวกรองสถานะ:</strong> กรองดูเฉพาะรถที่ "ว่าง", "ถูกจอง", "กำลังเช่า" หรือ "นำส่งซ่อม"',
        '<strong>ค้นหาอัจฉริยะ:</strong> ค้นหาตามชื่อรุ่น ยี่ห้อ หรือเลขทะเบียนได้อย่างรวดเร็ว',
        '<strong>Action Controls:</strong> ปุ่มแก้ไขข้อมูล (Edit), เปลี่ยนสถานะทันที (Toggle Status) และปุ่มลบ (Delete)'
      ],
      img: '12_admin_cars.png',
      url: 'http://localhost:5173 (View: admin-cars)'
    },
    {
      num: '13',
      badge: 'ADMIN OPERATIONS',
      badgeClass: 'badge-blue',
      title: 'หน้าต่างเพิ่ม & แก้ไขข้อมูลรถ (Add / Edit Vehicle Modal)',
      subtitle: 'ฟอร์มบันทึกข้อมูลรถยนต์คันใหม่ลงฐานข้อมูล MySQL พร้อมระบบพรีวิวรูปภาพ',
      points: [
        '<strong>ฟอร์มระบุสเปกละเอียด:</strong> ยี่ห้อ, รุ่น, ประเภทรถ (Sedan/SUV/Scooter), ปีที่จดทะเบียน',
        '<strong>การตั้งค่าการขับขี่:</strong> ระบบเกียร์ (ออโต้ CVT / ธรรมดา), ประเภทเชื้อเพลิง, จำนวนที่นั่ง',
        '<strong>ราคาและป้ายทะเบียน:</strong> กำหนดราคาค่าเช่าต่อวัน และหมวดจังหวัดป้ายทะเบียน',
        '<strong>ระบบพรีวิวรูปภาพ:</strong> แสดงตัวอย่างรูปภาพรถทันทีเมื่อวาง URL หรือเลือกรูป'
      ],
      img: '13_admin_car_modal.png',
      url: 'http://localhost:5173 (Modal: Add Car Modal)'
    },
    {
      num: '14',
      badge: 'ADMIN BOOKINGS',
      badgeClass: 'badge-emerald',
      title: 'จัดการรายการจอง & อนุมัติการเช่า (Bookings Management)',
      subtitle: 'ศูนย์รวมรายการจองของลูกค้า คัดกรองตามสถานะ และอนุมัติการเช่า-การคืนรถ',
      points: [
        '<strong>ตารางคำขอจอง:</strong> รหัสใบจอง, ข้อมูลผู้เช่า, เบอร์ติดต่อ, รุ่นรถ, วันที่เช่า และยอดเงินรวม',
        '<strong>แท็บคัดกรองสถานะ:</strong> ทั้งหมด, รอยืนยัน, ยืนยันแล้ว, กำลังใช้งาน, คืนรถแล้ว, ยกเลิก',
        '<strong>ปุ่มปรับเปลี่ยนสถานะ:</strong> กดอนุมัติเมื่อตรวจสลิปผ่าน ➔ ปรับเป็นกำลังใช้งาน ➔ ปรับเป็นคืนรถแล้ว',
        '<strong>ซิงค์สถานะรถอัตโนมัติ:</strong> เมื่อกด "คืนรถแล้ว" สถานะรถในระบบจะถูกปลดล็อกกลับมาเป็น "ว่าง" ทันที'
      ],
      img: '14_admin_bookings.png',
      url: 'http://localhost:5173 (View: admin-bookings)'
    },
    {
      num: '15',
      badge: 'SLIP VERIFICATION',
      badgeClass: 'badge-emerald',
      title: 'ระบบตรวจสอบสลิปโอนเงิน (Slip Verification Modal)',
      subtitle: 'ป๊อปอัปตรวจสอบความถูกต้องของสลิปโอนเงิน PromptPay แบบความละเอียดสูง',
      points: [
        '<strong>ขยายภาพสลิปความละเอียดสูง:</strong> ตรวจสอบชื่อบัญชีปลายทาง วันที่ เวลา และยอดเงินโอน',
        '<strong>ป้องกันสลิปปลอมแปลง:</strong> แอดมินสามารถเทียบยอดเงินในระบบกับหลักฐานในสลิปได้แบบเคียงข้าง',
        '<strong>ปุ่มอนุมัติทันทีในหน้าเดียว:</strong> กด "ยืนยันการจอง" ได้ทันทีหลังจากตรวจสอบสลิปเรียบร้อย',
        '<strong>บันทึกประวัติการตรวจสอบ:</strong> บันทึกรหัสธุรกรรม TXN ลงตาราง `payments` ใน MySQL'
      ],
      img: '15_admin_slip_modal.png',
      url: 'http://localhost:5173 (Modal: Payment Slip Preview)'
    },
    {
      num: '16',
      badge: 'ADMIN & DATABASE',
      badgeClass: 'badge-purple',
      title: 'จัดการบัญชีผู้ใช้ & สิทธิ์ RBAC (User Management & Roles)',
      subtitle: 'ตรวจสอบรายชื่อสมาชิกทั้งหมด ปรับเลื่อนขั้นสิทธิ์ และควบคุมความปลอดภัยของระบบ',
      points: [
        '<strong>รายชื่อสมาชิกในระบบ:</strong> แสดงชื่อ, อีเมล, เบอร์โทรศัพท์, ข้อมูลใบขับขี่ และวันที่ลงทะเบียน',
        '<strong>Role Switcher (Customer ⮂ Admin):</strong> คลิกปุ่มเดียวเพื่อสลับสิทธิ์ผู้ใช้เป็นผู้ดูแลระบบหรือลูกค้า',
        '<strong>การควบคุมสิทธิ์ (RBAC):</strong> ป้องกันไม่ให้แอดมินลบบัญชีตนเอง และจำกัดการเข้าถึง API แอดมิน',
        '<strong>เชื่อมต่อ MySQL สมบูรณ์:</strong> รองรับการเพิ่ม แก้ไข ลบสมาชิก พร้อมระบบ Cascade ลบประวัติที่เกี่ยวข้อง'
      ],
      img: '16_admin_users.png',
      url: 'http://localhost:5173 (View: admin-users)'
    }
  ];

  let slidesHtml = '';

  // Slide 0: Cover Slide
  slidesHtml += `
    <div class="slide cover-slide">
      <div class="cover-content">
        <div class="brand-tag">🚗 DRIVENOW CAR & MOTORCYCLE RENTAL PLATFORM</div>
        <h1 class="cover-title">รายงานภาพหน้าจอระบบ<br/><span class="gradient-text">DriveNow Web Application</span></h1>
        <p class="cover-subtitle">คู่มือภาพหน้าจอการใช้งานของ User, ระบบบริหารจัดการของ Admin และสถาปัตยกรรมระบบ</p>
        
        <div class="cover-meta-grid">
          <div class="meta-box">
            <span class="meta-label">💻 FRONTEND STACK</span>
            <span class="meta-value">React 19 • Vite • Tailwind CSS • Framer Motion</span>
          </div>
          <div class="meta-box">
            <span class="meta-label">⚙️ BACKEND & API</span>
            <span class="meta-value">Node.js • Express 5 • JWT HttpOnly • Bcrypt</span>
          </div>
          <div class="meta-box">
            <span class="meta-label">🗄️ DATABASE ENGINE</span>
            <span class="meta-value">MySQL 8.0+ (Relational Foreign Keys)</span>
          </div>
          <div class="meta-box">
            <span class="meta-label">🛡️ SECURITY & ROLES</span>
            <span class="meta-value">Role-Based Access Control (Admin / Customer)</span>
          </div>
        </div>

        <div class="cover-footer">
          <span>📍 บริการเช่ารถยนต์และรถจักรยานยนต์ออนไลน์ • สงขลา-หาดใหญ่</span>
          <span>📅 วันที่จัดทำ: ตุลาคม 2026 • เวอร์ชัน 2.0 Production</span>
        </div>
      </div>
    </div>
  `;

  // Slides 1 - 16
  slidesData.forEach((s, idx) => {
    const base64Img = getBase64Image(s.img);
    slidesHtml += `
      <div class="slide app-slide">
        <div class="slide-header">
          <div class="header-left">
            <span class="logo-mini">🚗 <strong>DriveNow</strong></span>
            <span class="badge ${s.badgeClass}">${s.badge}</span>
            <span class="route-hint">${s.url}</span>
          </div>
          <div class="header-right">
            <span class="slide-counter">SLIDE ${s.num} / 16</span>
          </div>
        </div>

        <div class="slide-body">
          <div class="info-sidebar">
            <h2 class="slide-title">${s.title}</h2>
            <p class="slide-subtitle">${s.subtitle}</p>

            <div class="features-card">
              <div class="features-heading">✨ ฟังก์ชันเด่นในหน้านี้:</div>
              <ul class="points-list">
                ${s.points.map(pt => `<li>${pt}</li>`).join('')}
              </ul>
            </div>

            <div class="slide-subnote">
              <span class="dot-indicator"></span> ใช้งานผ่านเบราว์เซอร์ Responsive รองรับ Mobile & Desktop
            </div>
          </div>

          <div class="screenshot-display">
            <div class="window-frame">
              <div class="window-topbar">
                <div class="window-dots">
                  <span class="dot dot-red"></span>
                  <span class="dot dot-yellow"></span>
                  <span class="dot dot-green"></span>
                </div>
                <div class="window-addressbar">
                  <span>🔒 https://drivenow.com/app/#${s.img.replace('.png', '')}</span>
                </div>
                <div class="window-actions">
                  <span>98%</span>
                </div>
              </div>
              <div class="window-content">
                <img src="${base64Img}" alt="${s.title}" class="app-screen-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // Slide 17: Database Architecture & ER Diagram
  slidesHtml += `
    <div class="slide db-slide">
      <div class="slide-header">
        <div class="header-left">
          <span class="logo-mini">🚗 <strong>DriveNow</strong></span>
          <span class="badge badge-purple">DATABASE ARCHITECTURE</span>
          <span class="route-hint">MySQL 8.0 • drivenow_db Schema</span>
        </div>
        <div class="header-right">
          <span class="slide-counter">APPENDIX / ERD</span>
        </div>
      </div>

      <div class="db-content">
        <div class="db-text-panel">
          <h2 class="slide-title">โครงสร้างฐานข้อมูลเชิงสัมพันธ์ (Database Schema)</h2>
          <p class="slide-subtitle">ฐานข้อมูล MySQL ประกอบด้วย 4 ตารางหลัก เชื่อมโยงด้วย Foreign Key Constraints อย่างสมบูรณ์</p>
          
          <div class="db-table-cards">
            <div class="db-table-card">
              <div class="table-card-head"><span class="badge-sm">TABLE 1</span> <strong>users</strong></div>
              <p>จัดเก็บบัญชีผู้ใช้, รหัสผ่าน Bcrypt, เลขบัตรประชาชน, ใบขับขี่ และสิทธิ์ (customer / admin)</p>
            </div>
            <div class="db-table-card">
              <div class="table-card-head"><span class="badge-sm">TABLE 2</span> <strong>cars</strong></div>
              <p>จัดเก็บยานพาหนะ (Car / Mt), สเปก, เกียร์, ความจุ, ราคาต่อวัน และสถานะ (ว่าง, ถูกจอง, กำลังเช่า, ซ่อม)</p>
            </div>
            <div class="db-table-card">
              <div class="table-card-head"><span class="badge-sm">TABLE 3</span> <strong>bookings</strong></div>
              <p>จัดเก็บใบจอง เชื่อม users + cars, วันที่เช่า, ยอดเงินรวม, สลิปโอนเงิน, สถานะ และคะแนนรีวิว 1-5 ดาว</p>
            </div>
            <div class="db-table-card">
              <div class="table-card-head"><span class="badge-sm">TABLE 4</span> <strong>payments</strong></div>
              <p>จัดเก็บประวัติธุรกรรมการเงิน เชื่อม bookings, ยอดเงิน, รหัสอ้างอิง TXN และสถานะตรวจสอบสลิป</p>
            </div>
          </div>
        </div>

        <div class="db-erd-panel">
          <div class="erd-diagram-box">
            <div class="erd-title">📊 Entity-Relationship Diagram (ERD)</div>
            <div class="erd-visual">
              <div class="erd-entity entity-users">
                <div class="ent-header">USERS (ผู้ใช้)</div>
                <div class="ent-field pk">PK user_id</div>
                <div class="ent-field uk">UK email</div>
                <div class="ent-field">name, phone</div>
                <div class="ent-field">role (customer/admin)</div>
                <div class="ent-field">id_card, driver_license</div>
              </div>

              <div class="erd-arrow-box">
                <span class="erd-rel">1 : N</span>
                <span class="erd-arrow">➔</span>
              </div>

              <div class="erd-entity entity-bookings">
                <div class="ent-header">BOOKINGS (การจอง)</div>
                <div class="ent-field pk">PK booking_id</div>
                <div class="ent-field fk">FK user_id ➔ users</div>
                <div class="ent-field fk">FK car_id ➔ cars</div>
                <div class="ent-field">start_date, end_date</div>
                <div class="ent-field">total_price, status</div>
                <div class="ent-field">payment_slip, rating</div>
              </div>

              <div class="erd-arrow-box">
                <span class="erd-rel">1 : 1</span>
                <span class="erd-arrow">➔</span>
              </div>

              <div class="erd-entity entity-payments">
                <div class="ent-header">PAYMENTS (การชำระเงิน)</div>
                <div class="ent-field pk">PK payment_id</div>
                <div class="ent-field fk">FK booking_id ➔ bookings</div>
                <div class="ent-field">amount, payment_date</div>
                <div class="ent-field">payment_status</div>
                <div class="ent-field">ref_number (TXN)</div>
              </div>
            </div>

            <div class="erd-secondary-row">
              <div class="erd-entity entity-cars">
                <div class="ent-header">CARS (ยานพาหนะ)</div>
                <div class="ent-field pk">PK car_id</div>
                <div class="ent-field">vehicle_type (Car, Mt)</div>
                <div class="ent-field">brand, model, type</div>
                <div class="ent-field">price_per_day, status</div>
                <div class="ent-field">plate_number, seats</div>
              </div>
              <div class="erd-cars-connector">
                <span>1 : N Connection ➔ เชื่อมโยงเข้าสู่ตาราง BOOKINGS ด้วย Foreign Key (car_id)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>DriveNow App Presentation - Slides</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Prompt:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Kanit', sans-serif;
      background-color: #070b14;
      color: #f1f5f9;
      width: 297mm;
      margin: 0 auto;
    }

    @page {
      size: A4 landscape;
      margin: 0;
    }

    .slide {
      width: 297mm;
      height: 210mm;
      max-height: 210mm;
      page-break-after: always;
      break-after: page;
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at top right, #131d33 0%, #070b14 65%);
      display: flex;
      flex-direction: column;
      padding: 14mm 16mm 12mm 16mm;
    }

    /* COVER SLIDE */
    .cover-slide {
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle at center, #172554 0%, #0a0f1d 55%, #050811 100%);
      padding: 24mm 20mm;
      text-align: center;
    }

    .cover-content {
      max-width: 240mm;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand-tag {
      font-family: 'Prompt', sans-serif;
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: 2px;
      color: #60a5fa;
      background: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(96, 165, 250, 0.3);
      padding: 6px 18px;
      border-radius: 999px;
      margin-bottom: 8mm;
      display: inline-block;
    }

    .cover-title {
      font-family: 'Prompt', sans-serif;
      font-size: 30pt;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 5mm;
      color: #ffffff;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 13pt;
      color: #94a3b8;
      max-width: 200mm;
      margin-bottom: 10mm;
      font-weight: 400;
      line-height: 1.5;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5mm;
      width: 100%;
      margin-bottom: 10mm;
    }

    .meta-box {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px 14px;
      text-align: left;
    }

    .meta-label {
      display: block;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: #38bdf8;
      margin-bottom: 4px;
    }

    .meta-value {
      display: block;
      font-size: 9.5pt;
      font-weight: 500;
      color: #e2e8f0;
      line-height: 1.3;
    }

    .cover-footer {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-top: 5mm;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 9pt;
      color: #64748b;
    }

    /* SLIDE HEADER */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 3.5mm;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 4mm;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-mini {
      font-family: 'Prompt', sans-serif;
      font-size: 11pt;
      color: #ffffff;
      letter-spacing: 0.5px;
    }

    .badge {
      font-size: 8pt;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    .badge-blue { background: rgba(59, 130, 246, 0.18); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.4); }
    .badge-purple { background: rgba(168, 85, 247, 0.18); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.4); }
    .badge-emerald { background: rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.4); }
    .badge-amber { background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.4); }

    .route-hint {
      font-family: 'Inter', monospace;
      font-size: 7.5pt;
      color: #64748b;
      background: rgba(15, 23, 42, 0.6);
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .slide-counter {
      font-family: 'Inter', sans-serif;
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #64748b;
    }

    /* SLIDE BODY LAYOUT */
    .slide-body {
      display: flex;
      gap: 6mm;
      flex: 1;
      height: calc(210mm - 32mm);
      overflow: hidden;
    }

    .info-sidebar {
      width: 86mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .slide-title {
      font-family: 'Prompt', sans-serif;
      font-size: 15.5pt;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.25;
      margin-bottom: 2mm;
    }

    .slide-subtitle {
      font-size: 9.5pt;
      color: #94a3b8;
      line-height: 1.4;
      margin-bottom: 3.5mm;
    }

    .features-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px 14px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .features-heading {
      font-size: 9.5pt;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .points-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 7px;
      font-size: 8.6pt;
      color: #cbd5e1;
      line-height: 1.35;
    }

    .points-list li {
      position: relative;
      padding-left: 14px;
    }

    .points-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #3b82f6;
      font-size: 12pt;
      line-height: 10pt;
    }

    .points-list strong {
      color: #ffffff;
      font-weight: 600;
    }

    .slide-subnote {
      font-size: 8pt;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 6px;
      padding-top: 3mm;
    }

    .dot-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }

    /* SCREENSHOT DISPLAY */
    .screenshot-display {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .window-frame {
      width: 100%;
      height: 100%;
      background: #0b1120;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .window-topbar {
      height: 28px;
      background: #0f172a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 12px;
    }

    .window-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }

    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }

    .window-addressbar {
      flex: 1;
      background: #070b14;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 6px;
      height: 18px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      font-family: 'Inter', monospace;
      font-size: 7pt;
      color: #64748b;
    }

    .window-actions {
      font-size: 7.5pt;
      color: #475569;
      font-family: 'Inter', sans-serif;
    }

    .window-content {
      flex: 1;
      overflow: hidden;
      background: #0b0f19;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .app-screen-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      object-position: top center;
    }

    /* DATABASE SLIDE STYLES */
    .db-content {
      display: flex;
      gap: 8mm;
      height: calc(210mm - 32mm);
    }

    .db-text-panel {
      width: 100mm;
      display: flex;
      flex-direction: column;
      gap: 3mm;
    }

    .db-table-cards {
      display: flex;
      flex-direction: column;
      gap: 2.5mm;
      margin-top: 2mm;
    }

    .db-table-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px 12px;
    }

    .table-card-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 10pt;
      color: #ffffff;
      margin-bottom: 4px;
    }

    .badge-sm {
      font-size: 6.5pt;
      font-weight: 700;
      background: #1e293b;
      color: #38bdf8;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .db-table-card p {
      font-size: 8pt;
      color: #94a3b8;
      line-height: 1.35;
    }

    .db-erd-panel {
      flex: 1;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 14px;
      display: flex;
      flex-direction: column;
    }

    .erd-diagram-box {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 8px;
    }

    .erd-title {
      font-size: 10pt;
      font-weight: 700;
      color: #c084fc;
      margin-bottom: 4px;
    }

    .erd-visual {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex: 1;
    }

    .erd-entity {
      flex: 1;
      background: #0a0f1d;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 8px;
      font-size: 7.5pt;
    }

    .ent-header {
      font-weight: 700;
      color: #60a5fa;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 4px;
      margin-bottom: 4px;
      font-size: 8pt;
    }

    .ent-field {
      color: #cbd5e1;
      line-height: 1.35;
    }

    .ent-field.pk { color: #f59e0b; font-weight: 600; }
    .ent-field.fk { color: #a855f7; font-weight: 600; }
    .ent-field.uk { color: #10b981; font-weight: 600; }

    .erd-arrow-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      color: #64748b;
      font-size: 7pt;
      font-weight: 700;
    }

    .erd-arrow {
      font-size: 12pt;
      color: #3b82f6;
    }

    .erd-secondary-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #070b14;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 8px;
    }

    .erd-secondary-row .erd-entity {
      width: 140px;
      flex: none;
    }

    .erd-cars-connector {
      font-size: 8pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>
  `;

  const htmlPath = path.join(OUTPUT_DIR, 'presentation.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('✅ presentation.html generated successfully at:', htmlPath);
  return htmlPath;
}

async function renderPdfFromHtml(htmlPath) {
  console.log('📄 Rendering PDF via Chrome headless...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await sleep(1500);

  await page.pdf({
    path: FINAL_PDF_PATH,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();
  console.log('🎉 PDF successfully created at:', FINAL_PDF_PATH);
  const stats = fs.statSync(FINAL_PDF_PATH);
  console.log(`📦 PDF File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

async function main() {
  console.log('====================================================');
  console.log('🎬 Starting DriveNow Full Presentation PDF Generator');
  console.log('====================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1600,1000',
      '--force-device-scale-factor=1.5'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1.5 });

  await captureScreenshots(page);
  await browser.close();

  const htmlPath = generatePresentationHtml();
  await renderPdfFromHtml(htmlPath);

  console.log('====================================================');
  console.log('✨ All Done! DriveNow_App_Screenshots.pdf is ready.');
  console.log('====================================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
