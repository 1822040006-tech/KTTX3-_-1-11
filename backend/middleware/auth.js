const jwt = require('jsonwebtoken');
const SECRET_KEY = 'bi_mat_khong_the_tiet_lo';

const xacThuc = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không tìm thấy Token. Vui lòng đăng nhập!' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { xacThuc, SECRET_KEY };