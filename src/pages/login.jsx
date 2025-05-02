import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { saveToken } from '../utils/auth';
import '../styles/login.css'; // CSS dosyasını ekleyin
import Navbar from '../components/main/navbar'
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await API.post('/auth/login', { username, password });
            saveToken(res.data.token);
            setMessage('Giriş başarılı!');
            navigate('/'); // Başarıyla giriş yaptıktan sonra yönlendirme
        } catch (err) {
            setMessage(err.response?.data?.error || 'Bir hata oluştu.');
        }
    };

    return (
      <>
      <Navbar/>
        <div className='login-form-container'>
           <div className="login-form-wrapper">
            <small>fanGang</small>
           <h2 className='login-form-title'>Giriş Yap</h2>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı Adı" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" />
            <button className='login-form-button' onClick={handleLogin}>Giriş</button>
            <p>{message}</p>
           </div>
        </div>
      </>
    );
};

export default Login;