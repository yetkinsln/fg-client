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
                <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXhmZmdnY2EzOWRpb3oyeGVneTNqeXY2YzR4Yzc0Y2ozemsxOGZ1YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TjAcxImn74uoDYVxFl/giphy.gif" alt="Card 1" className="card-image" />
                <div className="card-content">
                    <h3>Futbolcu Ekle</h3>
                    <p>Henüz eklenmemiş bir oyuncuyu seçip ekleyebilirsin!</p>
                    <a href="add-player" className="card-button">Seç</a>
                </div>
            </div>
            <div className="card">
                <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa204cnM4bGxwNWkxMXY0YTI0c3F1dmIyYWJrNjZ0YzFoNGpoZzZnZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/67ThRZlYBvibtdF9JH/giphy.gif" alt="Card 2" className="card-image" />
                <div className="card-content">
                    <h3>Müzayede</h3>
                    <p>Ekli futbolcuların değerini belirle.</p>
                    <a href="/auction" className="card-button">Seç</a>
                </div>
            </div>
            <div className="card">
                <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmF6NjFleG1vY2luaXJocGQxNHF3bHJrYnprcmRlY28wZWNmNTRpaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ie3U6gTmbY4KTQtOPJ/giphy.gif" alt="Card 3" className="card-image" />
                <div className="card-content">
                    <h3>Keşfet</h3>
                    <p>Oyuncu vitrinine göz at.</p>
                    <a href="/discover" className="card-button">Seç</a>
                </div>
            </div>

            <div className="card">
                <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExanlzcjJ4dzJmN2g3MXk5OXJ6cHRweHBwcnNpNmY3dWp1N3VrNWtieCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7qDXDa3rWNrBUuxq/giphy.gif" alt="Card 4" className="card-image" />
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