const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { xacThuc, SECRET_KEY } = require('./middleware/auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API Đăng nhập
app.post('/login', (req, res) => {
    const { email, matKhau } = req.body;
    if (email === 'admin@gmail.com' && matKhau === '123456') {
        const token = jwt.sign({ email, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Đăng nhập thành công!', token });
    }
    return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác!' });
});

// API Lấy danh sách sản phẩm (Bảo mật qua xacThuc)
app.get('/api/products', xacThuc, (req, res) => {
    const dsSanPham = [
        { id: 1, ten: 'Bút thiên long', gia: 5000 },
        { id: 2, ten: 'Vở 200 trang', gia: 15000 },
        { id: 3, ten: 'Thước kẻ 20cm', gia: 8000 },
        { id: 4, ten: 'Hộp màu vẽ 12 màu', gia: 45000 }
    ];
    return res.status(200).json(dsSanPham);
});

app.get('/', (req, res) => {
    res.send('Backend Server đang hoạt động tốt!');
});

app.listen(PORT, () => console.log(`Server Backend đang chạy tại http://localhost:${PORT}`));