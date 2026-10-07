const fs = require('fs');

// 1. Update mockData.js
let mockData = fs.readFileSync('src/services/mockData.js', 'utf8');

// Change CAR-002 model
mockData = mockData.replace(/car_id: 'CAR-002',[\s\S]*?model: '.*?',/, 
`car_id: 'CAR-002',
    vehicle_type: 'Car',
    brand: 'Toyota',
    model: 'Yaris ATIV',`);

// Remove plate_number completely from all cars
mockData = mockData.replace(/\s*plate_number: '.*?',/g, '');

fs.writeFileSync('src/services/mockData.js', mockData);

// 2. Update AdminCarsPage.jsx
let adminCars = fs.readFileSync('src/pages/admin/AdminCarsPage.jsx', 'utf8');
adminCars = adminCars.replace(/<div className="text-\[10px\] text-slate-400">\{isEn \? 'Plate:' : 'ทะเบียน:'\} \{car\.plate_number \|\| '-'\}.*?<\/div>/g, '');
fs.writeFileSync('src/pages/admin/AdminCarsPage.jsx', adminCars);

console.log('done');
