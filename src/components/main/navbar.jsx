import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <a href="/">FanGang</a>
                </div>
                <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
                <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <li><a href="/">Ana Sayfa</a></li>
                    <li><a href="mailto:fangang.football@gmail.com">İletişim</a></li>

                    {isLoggedIn ? (
                        <>
                            <li><a href="/my-players">Oyuncularım</a></li>
                            <li><button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button></li>
                        </>
                    ) : (
                        <>
                            <li><a href="/login">Giriş Yap</a></li>
                            <li><a href="/register">Kayıt Ol</a></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
