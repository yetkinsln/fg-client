import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/discoverPage.css'; // Keşfet sayfası CSS

const DiscoverPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBanStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const res = await axios.get('api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (res.data.isBanned) {
          alert('Hesabınız banlandığı için erişiminiz engellendi.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
  
      } catch (err) {
        console.error('Ban kontrolü hatası:', err);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };
  
    checkBanStatus();
  }, []);
  

  useEffect(() => {
    const fetchRandomPlayers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/auction/random-players', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayers(response.data);
      } catch (error) {
        console.error('Rastgele oyuncular alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPlayers();
  }, []);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace('.', ',') + 'm€';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k€';
    } else {
      return value + '€';
    }
  };

  const handlePlayerClick = (id) => {
    navigate(`/auction/${id}`);
  };

  return (
    <div className="wwm-discover-container">
      <h1 className="wwm-discover-title">Keşfet</h1>

      {loading ? (
        <div className="wwm-loading">Yükleniyor...</div>
      ) : (
        <div className="wwm-discover-grid">
          {players.map((player) => (
            <div 
              key={player._id} 
              className="wwm-discover-card" 
              onClick={() => handlePlayerClick(player.Name)}
            >
              <img
                src={player.image || 'https://via.placeholder.com/150'}
                alt={player.fullName}
                className="wwm-discover-image"
              />
              <div className="wwm-discover-info">
                <p className="wwm-discover-name">{player.Name}</p>
                <p className="wwm-discover-fangang">{formatCurrency(player.fangangValue)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
