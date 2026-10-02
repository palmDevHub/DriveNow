// Thai Baht formatter
export const formatTHB = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(amount).replace('THB', '฿');
};

// Calculate rental duration in days
export const calculateDays = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return 1;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// Date formatter in Thai format (e.g. 25 ต.ค. 2025)
export const formatThaiDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543; // Buddhist era
  
  return `${day} ${month} ${year}`;
};

// Status badge styling helper
export const getCarStatusBadge = (status) => {
  switch (status) {
    case 'ว่าง':
    case 'available':
      return { text: 'ว่างพร้อมเช่า', bg: 'bg-emerald-500/10', color: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'ถูกจอง':
    case 'reserved':
      return { text: 'ถูกจองแล้ว', bg: 'bg-amber-500/10', color: 'text-amber-400', border: 'border-amber-500/30' };
    case 'กำลังเช่า':
    case 'rented':
      return { text: 'กำลังถูกเช่า', bg: 'bg-blue-500/10', color: 'text-blue-400', border: 'border-blue-500/30' };
    case 'ซ่อม':
    case 'maintenance':
      return { text: 'อยู่ระหว่างซ่อมบำรุง', bg: 'bg-rose-500/10', color: 'text-rose-400', border: 'border-rose-500/30' };
    default:
      return { text: status, bg: 'bg-slate-500/10', color: 'text-slate-400', border: 'border-slate-500/30' };
  }
};

export const getBookingStatusBadge = (status) => {
  switch (status) {
    case 'รอชำระเงิน':
      return { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', label: 'รอชำระเงิน' };
    case 'รอยืนยัน':
      return { bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', label: 'รอยืนยันสลิป' };
    case 'ยืนยันแล้ว':
      return { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'อนุมัติการจองแล้ว' };
    case 'กำลังใช้งาน':
      return { bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', label: 'กำลังใช้งานรถ' };
    case 'คืนรถแล้ว':
    case 'เสร็จสิ้น':
      return { bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30', label: 'คืนรถเรียบร้อย' };
    case 'ยกเลิก':
      return { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30', label: 'ยกเลิกการจอง' };
    default:
      return { bg: 'bg-gray-500/15 text-gray-400 border-gray-500/30', label: status };
  }
};
