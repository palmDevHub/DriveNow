const fs = require('fs');

let text = fs.readFileSync('src/services/mockData.js', 'utf8');

// Replace CAR-001 image
text = text.replace(
  /'https:\/\/images.unsplash.com\/photo-1621007947382-bb3c3994e3fb\?auto=format&fit=crop&w=800&q=80'/,
  "'/Car1.jpg'"
);

// Replace CAR-002 image
text = text.replace(
  /'https:\/\/images.unsplash.com\/photo-1606664515524-ed2f786a0bd6\?auto=format&fit=crop&w=800&q=80'/,
  "'/Car2.jpg'"
);

// Replace MT-001 image
text = text.replace(
  /'https:\/\/images.unsplash.com\/photo-1558981403-c5f9899a28bc\?auto=format&fit=crop&w=800&q=80'/,
  "'/Mt1.jpg'"
);

// Replace MT-002 image
text = text.replace(
  /'https:\/\/images.unsplash.com\/photo-1599819811279-d5ad9cccf838\?auto=format&fit=crop&w=800&q=80'/,
  "'/Mt2.jpg'"
);

// Check if we need to add a third motorcycle for Mt3.jpg
if (!text.includes('MT-003')) {
  const mt3 = `  {
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
    plate_number: '3กง 9999 สงขลา',
    image: '/Mt3.jpg',
    description: 'สกู๊ตเตอร์คลาสสิกดีไซน์พรีเมียม ขับขี่โดดเด่นไม่ซ้ำใคร'
  }`;
  
  // Insert MT-003 before the end of INITIAL_CARS array
  text = text.replace(/  }\n\];/, '  },\n' + mt3 + '\n];');
}

fs.writeFileSync('src/services/mockData.js', text);

console.log("mockData.js updated with local image paths.");
