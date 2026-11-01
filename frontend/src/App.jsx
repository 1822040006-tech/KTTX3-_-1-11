import React, { useState, useEffect } from 'react';

function App() {
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, matKhau })
            });
            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('token', result.token);
                setToken(result.token);
            } else {
                setError(result.message || 'Đăng nhập thất bại!');
            }
        } catch (err) {
            setError('Lỗi kết nối tới Server!');
        }
    };

    useEffect(() => {
        if (!token) return;

        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:3000/api/products', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resData = await response.json();
                if (response.ok) {
                    setData(resData);
                } else {
                    setError(resData.message || 'Không thể lấy dữ liệu sản phẩm!');
                }
            } catch (err) {
                setError('Lỗi mạng khi tải sản phẩm!');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setData([]);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: 'auto' }}>
            <h2>Quản lý sản phẩm bảo mật</h2>
            {!token ? (
                <form onSubmit={handleLogin} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <h3>Đăng nhập</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div style={{ marginBottom: '10px' }}>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Mật khẩu:</label>
                        <input type="password" value={matKhau} onChange={(e) => setMatKhau(e.target.value)} required style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <button type="submit" style={{ padding: '8px 12px' }}>Đăng nhập</button>
                </form>
            ) : (
                <div>
                    <button onClick={handleLogout} style={{ marginBottom: '15px' }}>Đăng xuất</button>
                    <h3>Danh sách sản phẩm</h3>
                    {loading && <p style={{ fontStyle: 'italic' }}>Đang tải danh sách sản phẩm...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!loading && !error && (
                        <ul>
                            {data.map((sp) => (
                                <li key={sp.id}><strong>{sp.ten}</strong> - {sp.gia.toLocaleString()} VNĐ</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;