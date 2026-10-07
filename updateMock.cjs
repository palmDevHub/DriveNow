const fs = require('fs');
let text = fs.readFileSync('e:/car/src/services/mockData.js', 'utf8');

// Find INITIAL_CARS array
let startIdx = text.indexOf('export const INITIAL_CARS = [');
let endIdx = text.indexOf('];', startIdx);
let initialCarsText = text.substring(startIdx, endIdx);

// Replace brand: with vehicle_type: 'Car', brand:
let newCarsText = initialCarsText.replace(/brand:/g, 'vehicle_type: \'Car\',\n    brand:');

// Append some motorcycles
let motorcycles = `
  {
    vehicle_type: 'Mt',
    car_id: 'MT-001',
    brand: 'Honda',
    model: 'PCX 160',
    type: 'Scooter',
    price_per_day: 500,
    status: 'ว่าง',
    seats: 2,
    transmission: 'ออโต้',
    fuel: 'เบนซิน',
    year: 2023,
    plate_number: '1กข 1234 สงขลา',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    description: 'มอเตอร์ไซค์ออโตเมติกยอดนิยม ขับขี่สบาย ประหยัดน้ำมัน'
  },
  {
    vehicle_type: 'Mt',
    car_id: 'MT-002',
    brand: 'Yamaha',
    model: 'XMAX 300',
    type: 'Scooter',
    price_per_day: 800,
    status: 'ว่าง',
    seats: 2,
    transmission: 'ออโต้',
    fuel: 'เบนซิน',
    year: 2023,
    plate_number: '2กค 5678 สงขลา',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
    description: 'บิ๊กสกู๊ตเตอร์ดีไซน์สปอร์ต เครื่องยนต์แรง'
  }
`;

// Modify the text
let finalCarsText = newCarsText + ',' + motorcycles;
let finalFile = text.substring(0, startIdx) + finalCarsText + text.substring(endIdx);
fs.writeFileSync('e:/car/src/services/mockData.js', finalFile);
