// Thai Baht & Currency formatter
export const formatTHB = (amount, lang = 'th') => {
  if (lang === 'en') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(amount);
  }
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

// Date formatter supporting both TH & EN
export const formatDate = (dateString, lang = 'th') => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  if (lang === 'en') {
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${enMonths[date.getMonth()]} ${date.getFullYear()}`;
  }

  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543; // Buddhist era
  
  return `${day} ${month} ${year}`;
};

export const formatThaiDate = formatDate;

// Status badge styling helper
export const getCarStatusBadge = (status, lang = 'th') => {
  const isEn = lang === 'en';
  switch (status) {
    case 'ว่าง':
    case 'available':
      return { 
        text: isEn ? 'Available' : 'ว่างพร้อมเช่า', 
        badgeClass: 'car-status-badge car-status-available',
        bg: 'bg-emerald-600', 
        color: 'text-white font-bold', 
        border: 'border-emerald-400', 
        adminColor: 'text-emerald-400',
        dot: 'bg-emerald-200'
      };
    case 'ถูกจอง':
    case 'reserved':
      return { 
        text: isEn ? 'Reserved' : 'ถูกจองแล้ว', 
        badgeClass: 'car-status-badge car-status-reserved',
        bg: 'bg-amber-500', 
        color: 'text-slate-950 font-bold', 
        border: 'border-amber-300', 
        adminColor: 'text-amber-400',
        dot: 'bg-slate-900'
      };
    case 'กำลังเช่า':
    case 'rented':
      return { 
        text: isEn ? 'Rented' : 'กำลังถูกเช่า', 
        badgeClass: 'car-status-badge car-status-rented',
        bg: 'bg-blue-600', 
        color: 'text-white font-bold', 
        border: 'border-blue-400', 
        adminColor: 'text-blue-400',
        dot: 'bg-blue-200'
      };
    case 'ซ่อม':
    case 'maintenance':
      return { 
        text: isEn ? 'Maintenance' : 'อยู่ระหว่างซ่อมบำรุง', 
        badgeClass: 'car-status-badge car-status-maintenance',
        bg: 'bg-rose-600', 
        color: 'text-white font-bold', 
        border: 'border-rose-400', 
        adminColor: 'text-rose-400',
        dot: 'bg-rose-200'
      };
    default:
      return { 
        text: status, 
        badgeClass: 'car-status-badge bg-slate-700 text-white border-slate-500',
        bg: 'bg-slate-700', 
        color: 'text-white font-bold', 
        border: 'border-slate-500', 
        adminColor: 'text-slate-300',
        dot: 'bg-slate-300'
      };
  }
};

export const getBookingStatusBadge = (status, lang = 'th') => {
  const isEn = lang === 'en';
  switch (status) {
    case 'รอชำระเงิน':
      return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold', label: isEn ? 'Pending Payment' : 'รอชำระเงิน' };
    case 'รอยืนยัน':
      return { bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold', label: isEn ? 'Pending Slip Verification' : 'รอยืนยันสลิป' };
    case 'ยืนยันแล้ว':
      return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold', label: isEn ? 'Approved' : 'อนุมัติการจองแล้ว' };
    case 'กำลังใช้งาน':
      return { bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 font-semibold', label: isEn ? 'In Use' : 'กำลังใช้งานรถ' };
    case 'คืนรถแล้ว':
    case 'เสร็จสิ้น':
      return { bg: 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-semibold', label: isEn ? 'Returned' : 'คืนรถเรียบร้อย' };
    case 'ยกเลิก':
      return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-semibold', label: isEn ? 'Cancelled' : 'ยกเลิกการจอง' };
    default:
      return { bg: 'bg-gray-500/20 text-gray-300 border-gray-500/40 font-semibold', label: status };
  }
};
