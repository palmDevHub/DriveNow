const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ตั้งค่าการเชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',               // Username ของ MySQL
  password: '1234',  // ?? เปลี่ยนเป็นรหัสผ่าน MySQL ของคุณ
  database: 'drivenow_db'
});

db.connect(err => {
  if (err) {
    console.error('? เชื่อมต่อ MySQL ไม่สำเร็จ:', err.message);
  } else {
    console.log('? เชื่อมต่อ MySQL สำเร็จแล้ว!');
  }
});

app.get('/api/cars', (req, res) => {
  db.query('SELECT * FROM cars', (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

app.listen(5000, () => {
  console.log('?? Server รันที่ http://localhost:5000');
});
