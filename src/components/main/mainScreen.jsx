import React from 'react';
import Navbar from './navbar';
import '../../styles/mainscreen.css'; // Adjust the path as necessary

const MainScreen = () => {
    return (

    <>
    <Navbar />
    <div className="main-screen">

        <div className="card-container">
            <div className="card">
                <img src="https://i.pinimg.com/474x/9d/45/f4/9d45f4e4bca82de785ee726a12eda3c9.jpg" alt="Card 1" className="card-image" />
                <div className="card-content">
                    <h3>Futbolcu Ekle</h3>
                    <p>Henüz eklenmemiş bir oyuncuyu seçip ekleyebilirsin!</p>
                    <a href="add-player" className="card-button">Seç</a>
                </div>
            </div>
            <div className="card">
                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.fxVC00QqqsxUJohvW2ApBgHaE4%26pid%3DApi&f=1&ipt=e61bda11ce4f9d392f3cb80d0230ef92de4d4ecb096059077a1d362dbaa9cc39&ipo=images" alt="Card 2" className="card-image" />
                <div className="card-content">
                    <h3>Müzayede</h3>
                    <p>Ekli futbolcuların değerini belirle.</p>
                    <a href="/auction" className="card-button">Seç</a>
                </div>
            </div>
            <div className="card">
                <img src="https://i.pinimg.com/736x/17/0d/48/170d486808716c1e5925d4aca3d3c24e.jpg" alt="Card 3" className="card-image" />
                <div className="card-content">
                    <h3>Keşfet</h3>
                    <p>Oyuncu vitrinine göz at.</p>
                    <a href="/discover" className="card-button">Seç</a>
                </div>
            </div>

            <div className="card">
                <img src="https://i.pinimg.com/736x/a7/9f/8a/a79f8abfb5a6ce80b5a48bcff580ab6a.jpg" alt="Card 4" className="card-image" />
                <div className="card-content">
                    <h3>Genel Sohbet</h3>
                    <p>İnsanlar neyi tartışıyor?</p>
                    <a href="/topics" className="card-button">Seç</a>
                </div>
            </div>
        </div>
    </div>
    </>
    );
};

export default MainScreen;