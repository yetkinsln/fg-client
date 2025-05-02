import React, { useState } from 'react';
import API from '../services/api';
import '../styles/register.css';
import Navbar from '../components/main/navbar'
const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const res = await API.post('/auth/register', { username,email, password });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.error || 'Bir hata oluştu.');
        }
    };

    return (
       <>
       <Navbar/>
        <div className="register-container">
        <div className="register-form">
            <small>fanGang</small>
            <h2>Kayıt Ol</h2>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı Adı" />
            <input type='mail' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E mail Adresiniz" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" />
            <button onClick={handleRegister}>Kayıt</button>
            <p>{message}</p>
        </div>
    </div>
       </>
    );
};

export default Register;
